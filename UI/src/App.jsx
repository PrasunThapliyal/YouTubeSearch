import React, { useEffect, useState } from 'react';
import { useGetCurrentUserQuery } from './store/apiSlice';
import VideoGrid from './components/VideoGrid';

function App() {
  const [tokenResolved, setTokenResolved] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('jwtToken', token);
      window.history.replaceState({}, document.title, "/");
    }
    setTokenResolved(true);
  }, []);

  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery(undefined, {
    skip: !tokenResolved || !localStorage.getItem('jwtToken')
  });

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/api/auth/login";
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  };

  if (!tokenResolved) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold tracking-tight text-red-600">YouTube Saved Content</h1>
            <div>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Hello, {user.name}</span>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 font-semibold">Logout</button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors text-sm"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!user && !isUserLoading && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Access your saved YouTube videos instantly.
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Sign in securely with Google to view your implicitly saved content, like your "Liked Videos" list.
            </p>
          </div>
        )}
        {user && <VideoGrid />}
      </main>
    </div>
  );
}

export default App;
