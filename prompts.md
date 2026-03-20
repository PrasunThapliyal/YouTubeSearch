# YouTube Saved Content Search - Interaction History

This document logs the primary iterative prompts from the user and the system's corresponding architecture updates that led to exactly how the project was built.

### Prompt 1: Initial Vision & Tech Stack Request
> "I would like to create a web app that lets users sign in using Google, and then search their saved content on YouTube using this app... For the initial MVP, lets focus on only 1 query - list meta info (Title, Description, URL, etc) for all videos liked by a user. To begin with, I want you to articulate the requirement in a better way and document it... lay out a high level assessment on the requirements... Please assess if using React JS (Vite) for frontend, Dotnet Core 8 for backend, and Postgres for DB would be a good choice."

### Prompt 2: Moving Forward & Technical Blueprinting
> "Yes, lets begin with this single requirement for MVP... No restriction to use plain CSS - use any styling framework that you deem best... lets first articulate HLD and LLD, and once we are good with these design documents we can begin with the coding part... articulate step by step what I need to do on external sites, such as if any project creation needs to be done on Google Cloud Console etc. I also want a document briefly explaining the concepts, such as OAuth..."

### Prompt 3: Transitioning to True Microservices
> "Instead of having 1 microservice with Auth Controller and YouTube Controller, would it make sense to have 2 microservices - one dedicated for Auth and the Other for YouTube search. Also, assuming UI is another microservices, we would then have 3 services... each microservice will have so and so ports... we might need some entity to be the browser facing entity (like API Gateway)... I would like to take this project as an opportunity to ramp up on React... suggest proper state management infrastructure... create another .md file to explain UI concepts..."

### Prompt 4: Proceeding to Formal Planning
> "Everything looks great. Please create a formal implementation plan"

### Prompt 5: Enforcing Clean Microservice Database Boundaries
> "The Implementation plan looks good. I have PostgreSQL installed locally, and YARP is a good option as well... 2 microservices accessing the same Table doesn't sound right. Lets stick to the philosophy that each microservice has its own database when required. If YouTube microservice needs user data, it should query the Auth service via REST. Please update the plan or give suggestions on the comment"

### Prompt 6: Execution & Scaffolding
> *[User formally approved the Implementation Plan, signaling the AI to begin constructing the .NET Solutions, Projects, and React App].*

### Prompt 7: Resolving UI Tailwind Issues
> "The command seemed stuck and wasn't proceeding... I'm getting error invoking npx tailwindcss init -p..."
> *(The AI determined Tailwind CSS V4 requires a completely different compilation pattern via `@tailwindcss/vite` rather than `postcss.config.js` and automatically restructured the Vite configuration).*

### Prompt 8: Enforcing Port Bindings
> "The Auth Service started at port 5220. Please correct this .. YARP is expecting to see this service on localhost:5001. Similarly please check for YouTube Service and UI service as well"
> *(The AI hardcoded the `Properties/launchSettings.json` configurations to strictly bind to 5001, 5002, and 8080. The UI was previously locked to 3000).*

### Prompt 9: Database Provisioning
> "All right .. happy that it worked half way through, but I got the error: PostgresException: 3D000: database "YoutubeSearchDb" does not exist... I guess the DB creation is a manual step... Please create the DB or give me the command to create it. Lets try not to change the code at this point"
> *(The AI provided the exact Entity Framework Core C# CLI tools logic: `dotnet ef migrations add` and `dotnet ef database update`).*

### Prompt 10: Missing Endpoint Catch
> "It looks like the Auth Service must implement an endpoint like below http://localhost:5001/api/auth/user. Somehow the browser is sending this request and backend is sending 404"
> *(The AI instantly re-wrote `AuthController.cs` to append the `/api/auth/user` endpoint and successfully injected the `JwtBearer` authentication middleware to safely decode tokens sent by the UI).*

### Prompt 11: Cleanup & Git Configurations
> "Awesome .. please create a .gitignore file - one for each project"
> *(The AI generated `.gitignore` files for each C# Microservice and the React UI).*

### Prompt 12: Interaction Export
> "Can you export our interaction (prompts etc) into a file called prompts.md"
> *(This file was generated!)*
