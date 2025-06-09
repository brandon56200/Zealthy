'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export default function LoginPlease() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Box sx={{ mb: 3, position: 'relative', width: 200, height: 200 }}>
        <Image
          src="/fingerprint.svg"
          alt="Authentication required"
          fill
          style={{ objectFit: 'contain' }}
        />
      </Box>
      <Typography variant="h5" sx={{ mb: 2, color: '#374151' }}>
        Please Log In to Continue
      </Typography>
      <Typography variant="body1" sx={{ color: '#6B7280', maxWidth: '400px' }}>
        You need must be logged in to make changes to the onboarding form.
      </Typography>
    </Box>
  );
} 