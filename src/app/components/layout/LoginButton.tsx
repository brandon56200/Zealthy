'use client';

import { useState } from 'react';
import { Button, Box } from '@mui/joy';
import LoginPopover from './LoginPopover';
import { useAuth } from '@/lib/auth-context';

export default function LoginButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [resetPopover, setResetPopover] = useState(false);
  const { user, setUser } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setResetPopover(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    console.log('LoginButton - Logging out');
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
      
      setUser(null);
      setResetPopover(true);
      setAnchorEl(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        position: 'relative'
      }}
    >
      <Button
        onClick={user ? handleLogout : handleClick}
        size="sm"
        sx={{
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          backdropFilter: 'blur(4px)',
          borderRadius: '9999px',
          padding: '0.375rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'white',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          transition: 'all 0.3s ease',
          transform: user ? 'translateX(-40px)' : 'translateX(0)',
          '&:hover': {
            backgroundColor: 'rgb(31, 41, 55)',
          },
          '&:focus-visible': {
            outline: '2px solid rgb(31, 41, 55)',
            outlineOffset: '2px',
          },
        }}
      >
        {user ? 'Log Out' : 'Log In'}
      </Button>
      {user && (
        <Box
          component="div"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.3s ease-in-out',
            position: 'absolute',
            right: 0,
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.8)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }}
        >
          {getInitials(user.email)}
        </Box>
      )}
      <LoginPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        reset={resetPopover}
      />
    </Box>
  );
} 