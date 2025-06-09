'use client';

import { Box, Typography, Paper } from '@mui/material';
import { useEffect, useState } from 'react';

interface Stats {
  totalUsers: number;
  newestUser: {
    name: string;
    createdAt: string;
  } | null;
  newUsersLastWeek: number;
  completionRate: number;
}

const shimmerKeyframes = {
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200% 0',
    },
    '100%': {
      backgroundPosition: '200% 0',
    },
  },
};

const shimmerStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  ...shimmerKeyframes,
};

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          mb: 3,
          background: 'linear-gradient(17deg, rgba(100, 227, 144, 1) 0%, rgba(87, 199, 133, 1) 44%, rgba(182, 242, 136, 1) 87%)',
          borderRadius: 2,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              flex: 1,
              p: 1.5,
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              color: '#2D3748',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Box sx={{ ...shimmerStyle, height: '20px', width: '80px', borderRadius: '4px', mb: 1 }} />
            <Box sx={{ ...shimmerStyle, height: '32px', width: '100%', borderRadius: '4px' }} />
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        mb: 3,
        background: 'linear-gradient(17deg, rgba(100, 227, 144, 1) 0%, rgba(87, 199, 133, 1) 44%, rgba(182, 242, 136, 1) 87%)',
        borderRadius: 2,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 1.5,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          color: '#2D3748',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
          Total Users
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {stats.totalUsers}
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 1.5,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          color: '#2D3748',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
          Newest User
        </Typography>
        <Typography variant="h5" noWrap sx={{ fontWeight: 600, textAlign: 'center' }}>
          {stats.newestUser?.name || 'N/A'}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8, textAlign: 'center', display: 'block' }}>
          {stats.newestUser ? new Date(stats.newestUser.createdAt).toLocaleDateString() : ''}
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 1.5,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          color: '#2D3748',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
          New Users (7 Days)
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {stats.newUsersLastWeek}
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 1.5,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          color: '#2D3748',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
          Completion Rate
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {stats.completionRate}%
        </Typography>
      </Paper>
    </Box>
  );
} 