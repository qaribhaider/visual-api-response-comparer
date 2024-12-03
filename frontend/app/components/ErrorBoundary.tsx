'use client';

import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false 
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    
    // Optional: Send error to monitoring service
    // For example, Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: undefined,
      errorInfo: undefined 
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen bg-dark-100 flex flex-col justify-center items-center text-center p-4">
          <div className="bg-dark-50 p-8 rounded-lg shadow-xl max-w-md w-full">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Something went wrong</h1>
            <p className="text-dark-text-primary mb-6">
              We encountered an unexpected error. Do not worry, this is not your fault.
            </p>
            
            {this.state.error && (
              <div className="bg-dark-25 p-4 rounded mb-6 overflow-x-auto">
                <pre className="text-red-400 text-sm whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-dark-primary text-white rounded hover:bg-opacity-90 transition"
              >
                Reload Page
              </button>
              <button 
                onClick={this.handleReset}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-opacity-90 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
