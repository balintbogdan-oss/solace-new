'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const trimmedPassword = password.trim();
      // Login attempt (password not logged for security)
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: trimmedPassword }),
        cache: 'no-store'
      });

      const data = await response.json();
      // Login response received

      if (response.ok) {
        // Login successful, redirecting based on role
        // Add a small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect based on role
        if (data.role === 'client') {
          router.push('/client-dashboard');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        // Login failed
        setError('Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <svg width="42" height="26" viewBox="0 0 28 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
            <path fillRule="evenodd" clipRule="evenodd" d="M19.2158 1.93618C19.7433 0 21.326 0 21.326 0H27.3634L22.9672 14.492C22.4397 16.4282 20.857 16.4282 20.857 16.4282H14.8196L19.2158 1.93618ZM13.0025 1.64266C13.0025 1.64266 11.5957 1.64266 11.0682 3.40282L7.08228 16.428H12.4749C12.4749 16.428 13.8817 16.428 14.4093 14.6679L18.3952 1.58398L13.0025 1.64266ZM5.441 3.75516C5.441 3.75516 4.21006 3.75516 3.79975 5.28063L0.400024 16.4283H5.03069C5.03069 16.4283 6.26162 16.4283 6.67194 14.9028L10.0717 3.69649L5.441 3.75516Z" fill="currentColor" className="text-foreground"/>
          </svg>
          <h2 className="text-2xl font-serif ">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Please enter your password to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A56129]"
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button
            type="submit"
            className="w-full bg-[#1C1C1C] text-white hover:bg-[#2C2C2C]"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
} 