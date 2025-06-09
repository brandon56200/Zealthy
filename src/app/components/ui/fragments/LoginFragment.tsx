'use client';

import { useState } from 'react';
import { Typography } from '@mui/joy';
import { CustomTextField } from '../shared/CustomTextField';

interface LoginFragmentProps {
  onLoginSuccess: (userData: any) => void;
  onError?: (error: string) => void;
}

export default function LoginFragment({ onLoginSuccess, onError }: LoginFragmentProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onError?.('');

    try {
      // First, check if the email exists
      const checkResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const { exists } = await checkResponse.json();

      if (exists) {
        // If email exists, try to log in
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json();
          throw new Error(errorData.message || 'Invalid email or password');
        }

        const userData = await loginResponse.json();
        onLoginSuccess(userData);
      } else {
        // If email doesn't exist, register the user
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!registerResponse.ok) {
          const errorData = await registerResponse.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        const userData = await registerResponse.json();

        // After registration, log in the user
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json();
          throw new Error(errorData.message || 'Failed to login after registration');
        }

        const loggedInUserData = await loginResponse.json();
        onLoginSuccess(loggedInUserData);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography level="h4" sx={{ mb: 2 }}>
        Login Information
      </Typography>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-2 gap-8">
          <CustomTextField
            type="email"
            label="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <CustomTextField
            type="password"
            label="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            fullWidth
          />
        </div>
      </form>
    </>
  );
} 