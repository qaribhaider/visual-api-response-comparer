'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-dark-100 flex flex-col justify-center items-center text-center p-4">
          <div className="bg-dark-50 p-8 rounded-lg shadow-xl max-w-md w-full">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Application Error</h1>
            <p className="text-dark-text-primary mb-6">
              Something went wrong. We are working on fixing it.
            </p>
            
            <div className="bg-dark-25 p-4 rounded mb-6 overflow-x-auto">
              <pre className="text-red-400 text-sm whitespace-pre-wrap break-words">
                {error.message}
              </pre>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => reset()}
                className="px-4 py-2 bg-dark-primary text-white rounded hover:bg-opacity-90 transition"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-opacity-90 transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
