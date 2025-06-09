'use client';

import { useState } from 'react';
import { Popover } from '@mui/material';
import { Button, Typography } from '@mui/joy';
import { useAuth } from '@/lib/auth-context';
import { CustomTextField } from '../ui/shared/CustomTextField';

interface LoginPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

type AuthState = 'initial' | 'login' | 'register';

export default function LoginPopover({ open, anchorEl, onClose }: LoginPopoverProps) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>('initial');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authState === 'initial') {
        // First, check if the email exists
        const checkEmailResponse = await fetch('/api/users/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (!checkEmailResponse.ok) {
          throw new Error('Failed to check email');
        }

        const { exists } = await checkEmailResponse.json();
        setAuthState(exists ? 'login' : 'register');
        setPassword('');
        return;
      }

      // Handle login
      if (authState === 'login') {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to login');
        }

        const userData = await response.json();
        console.log('LoginPopover - Login successful:', { userData });
        
        // Update auth context
        setUser(userData);
        onClose();
        return;
      }

      // Handle registration
      if (authState === 'register') {
        const createUserResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!createUserResponse.ok) {
          const error = await createUserResponse.json();
          throw new Error(error.message || 'Failed to create user');
        }

        const newUser = await createUserResponse.json();
        console.log('LoginPopover - Registration successful:', { newUser });

        // Sign in the newly created user
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!loginResponse.ok) {
          const data = await loginResponse.json();
          throw new Error(data.error || 'Failed to login');
        }

        const userData = await loginResponse.json();
        console.log('LoginPopover - Auto-login successful:', { userData });
        
        // Update auth context
        setUser(userData);
        onClose();
      }
    } catch (err) {
      console.error('LoginPopover - Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setAuthState('initial');
    setPassword('');
    setError('');
  };

  const getTitle = () => {
    switch (authState) {
      case 'initial':
        return 'Log In / Register';
      case 'login':
        return 'Log In';
      case 'register':
        return 'Sign Up';
    }
  };

  const getSubtext = () => {
    switch (authState) {
      case 'initial':
        return 'Enter your email to continue';
      case 'login':
        return 'This email is registered. Enter your password to log in.';
      case 'register':
        return 'This email is not registered. Create a password to sign up.';
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 300,
          p: 2,
          mt: 1,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Typography level="h4" sx={{ mb: 1 }}>
          {getTitle()}
        </Typography>

        <Typography level="body-sm" sx={{ mb: 2 }}>
          {getSubtext()}
        </Typography>

        {error && (
          <Typography color="danger" level="body-sm">
            {error}
          </Typography>
        )}

        <CustomTextField
          label="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          fullWidth
          size="small"
          margin="normal"
          error={!!error}
        />

        {authState !== 'initial' && (
          <CustomTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            fullWidth
            size="small"
            margin="normal"
            error={!!error}
          />
        )}

        <div className="flex gap-2">
          {authState !== 'initial' && (
            <Button
              onClick={handleBack}
              variant="outlined"
              fullWidth
              sx={{
                mt: 2,
                borderColor: '#22c55e',
                color: '#22c55e',
                '&:hover': {
                  borderColor: '#16a34a',
                  backgroundColor: 'rgba(34, 197, 94, 0.04)',
                },
              }}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            sx={{
              backgroundColor: '#22c55e',
              '&:hover': {
                backgroundColor: '#16a34a',
              },
              mt: 2
            }}
          >
            {isLoading ? 'Loading...' : authState === 'initial' ? 'Continue' : authState === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </Popover>
  );
} 