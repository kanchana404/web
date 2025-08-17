'use client';

import { useAuth } from '@/app/contexts/auth-context';

export default function TestAuthPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current State:</h2>
          
          <div className="space-y-4">
            <div>
              <strong>Loading:</strong> {loading ? 'true' : 'false'}
            </div>
            
            <div>
              <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}
            </div>
            
            <div className="pt-4">
              <a 
                href="/signin" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded mr-4"
              >
                Go to Sign In
              </a>
              <a 
                href="/signup" 
                className="inline-block bg-green-600 text-white px-4 py-2 rounded"
              >
                Go to Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
