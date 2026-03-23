# Authentication Strategy & Comparison

This document outlines how authentication is handled in this application and compares the architectural approaches between Cookie-based and Token-based authentication.

## 1. The `.AspNetCore.Cookies` Session Ticket

In this application's Google OAuth flow, you will see a cookie named `.AspNetCore.Cookies` generated in the browser. 

**Is this the JWT token?**  
No. This cookie is an encrypted ASP.NET Core session ticket created temporarily during the external Google OAuth login flow (between the `/login` challenge and the `/callback` redirect).

The actual JWT token is generated separately and handed off to the frontend differently. Within `AuthController.cs`:

1. **Google Auth Finishes:** On line 38, it reads the Google identity from the temporary cookie system.
2. **JWT Generation:** On line 75, it calls `GenerateJwtToken(user)` which creates your actual JWT string.
3. **Delivery to Frontend:** On line 78, it redirects to your React frontend and passes the JWT in the URL query string: `return Redirect($"http://localhost:8080/?token={jwtToken}");`

So, your React app is expected to read the `?token=` parameter from the URL, save it (usually into `localStorage` or memory using Redux), and then attach it as a `Bearer` token in the `Authorization` header for all future requests to your API.

The `.AspNetCore.Cookies` cookie can safely be ignored (or even cleared) by the frontend once the login redirect finishes, because your API relies entirely on the `Bearer` token for subsequent authenticated requests like `[HttpGet("user")]`.

## 2. Cookie-based vs. Token-based Authentication

The two most common approaches to securing modern web applications:

### Cookie-based Authentication (Session Token in a Cookie)
The server issues a session token (or a JWT) and sends it to the browser via an HTTP response header (`Set-Cookie`). 

**Pros:**
- **XSS Protection:** If the cookie is marked `HttpOnly`, malicious JavaScript (Cross-Site Scripting) cannot read it from the browser.
- **Automatic:** The browser automatically attaches the cookie to every subsequent request to your domain. You don't have to manually attach it in frontend code.

**Cons:**
- **CSRF Vulnerability:** Because the browser *automatically* sends the cookie, malicious websites can trick the user's browser into making unauthorized requests to your API (Cross-Site Request Forgery). Anti-CSRF tokens must be implemented.
- **CORS Limitations:** It is extremely restrictive and complex to securely share cookies across different domains or subdomains.
- **Not Mobile/Desktop native:** Mobile apps (iOS/Android) don't have a built-in "browser cookie jar", requiring manual management.

### Token-based Authentication (Bearer Tokens in Memory/LocalStorage)
The server provides the raw JWT string to the frontend application, which explicitly attaches it to the `Authorization: Bearer <token>` header for every API call. This is the approach used in this project's React frontend.

**Pros:**
- **Immune to CSRF:** The browser does *not* automatically send the token. Since your frontend JavaScript has to explicitly attach the header, an attacker on a third-party site cannot forge a request.
- **Stateless & Scalable:** The JWT itself contains the user data (like their ID and email), meaning the server doesn't have to look up a session in the database for every single request.
- **Cross-Platform & Cross-Domain:** It's incredibly easy to use the same API for a React app, a mobile app, or a third-party integration by simply passing the token in the header.

**Cons:**
- **XSS Vulnerability:** If you store the token in `localStorage` or `sessionStorage`, any malicious JavaScript running on your page can read it and steal the user's session token. 

### Architecture Recommendation
For a Microservices architecture utilizing an API Gateway (like YARP) and communicating across different ports or domains, **Token-based Authentication** is preferred. It is drastically easier to route requests securely without fighting browser CORS and SameSite cookie policies. 

*(Note: Advanced architectures sometimes implement a Backend-For-Frontend (BFF) pattern, where the UI authenticates with a proxy using an `HttpOnly` cookie, and the proxy translates it into a Bearer JWT behind the scenes for the downstream microservices.)*

## 3. The Risks of Shared Symmetric Secrets & Alternative Approaches

Sharing a symmetric JWT secret (like HMAC/HS256) across multiple microservices is a common starting point but is not best practice for production architectures. The primary risk is that if any downstream service is compromised, the attacker acquires the shared secret and can forge perfectly valid JWTs for any user, compromising the entire system.

Here are the standard alternatives:

### Alternative 1: Asymmetric Keys (RS256 / Public & Private Keypair)
This is the industry standard for OIDC/OAuth providers (like Google, Auth0, IdentityServer). 
- **The Flow:** The React App attaches the JWT to the `Authorization: Bearer` header. The YARP API Gateway intercepts it and forwards it (header included) straight to the backend microservice (e.g., `YouTubeService`).
- **Signature & Verification:** The `AuthService` generates the JWT and mathematically *signs* it using its strictly guarded **Private Key**. The Public Key is distributed to all other microservices (often via a standard HTTP endpoint like `.well-known/jwks.json`). Microservices use the public key purely to *verify* the JWT. The microservice NEVER has access to the Private Key.
- **Decryption vs Verification:** Standard JWTs (JWS) are **NOT encrypted** (they are simply Base64 encoded). The Public Key does not *decrypt* the JWT; it only *verifies the cryptographic signature* attached to the token. This guarantees authenticity (who made it) and integrity (it hasn't been altered), but anyone who intercepts the token in transit can easily read the claims inside of it.
- **Pros:** Highly secure. If a downstream service is compromised, the attacker only gets the Public Key and cannot forge new tokens.
- **Cons:** Slightly computationally heavier to verify. Requires managing key rotation and JSON Web Key Sets (JWKS).

### Alternative 2: API Gateway Token Termination (The "Zero Trust Backend" Approach)
In this pattern, the backend microservices do not deal with JWTs or secrets at all. 
- **How it works:** The API Gateway intercepts all incoming requests, validates the JWT, rips it out of the request, and forwards the request to the backend microservice with a simple custom header (e.g., `X-User-Id: 12345`).
- **Pros:** Microservices become incredibly simple, fast, and decoupled. They require no identity libraries.
- **Cons:** You must strictly secure your internal network (e.g., using private virtual networks or mTLS). If an attacker bypasses the Gateway and hits the microservice locally with an injected `X-User-Id` header, they can impersonate anyone.

### Alternative 3: Reference Tokens (Opaque Tokens / Introspection)
Instead of sending a massive JWT, you send a random, meaningless string (a Reference Token).
- **How it works:** When the microservice receives the token, it cannot decode it itself. Instead, it makes an internal backend HTTP call to the `AuthService`'s `/introspect` endpoint, asking: *"Is this token valid, and who does it belong to?"*
- **Pros:** Ultimate control. If a user logs out or is banned, the `AuthService` revokes the token, and all downstream services immediately fail.
- **Cons:** Introduces severe network latency. Every single API call to your microservices results in an extra internal HTTP call back to the AuthService, which can bottleneck the entire system.
