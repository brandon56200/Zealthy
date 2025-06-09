'use client';

import { Box, Typography } from '@mui/material';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { FormFragment } from '@/types/schema';
import { useRef, useEffect } from 'react';

interface FragmentCardProps {
  fragment: FormFragment;
  id: string;
}

// Helper function to format fragment name
function formatFragmentName(fragment: string): string {
  return fragment
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to get fields for a fragment
function getFragmentFields(fragment: string): string[] {
  const fieldMap: Record<string, string[]> = {
    ABOUT_ME: ['Health Goals', 'Lifestyle', 'Health History', 'Preferences'],
    PERSONAL_INFO: ['First Name', 'Last Name', 'Date of Birth', 'Gender'],
    ADDRESS: ['Street Address', 'City', 'State', 'ZIP Code'],
    PHARMACY: ['Pharmacy Name', 'Address', 'City', 'State', 'ZIP Code', 'Phone'],
    INSURANCE_INFO: ['Provider', 'Policy Number', 'Group Number', 'Start Date', 'End Date'],
    LOGIN: ['Email', 'Password']
  };
  return fieldMap[fragment] || [];
}

export default function FragmentCard({ fragment, id }: FragmentCardProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;

    const cleanup = draggable({
      element: elementRef.current,
      dragHandle: elementRef.current,
      getInitialData: () => ({ fragment }),
    });

    return cleanup;
  }, [fragment]);

  const fields = getFragmentFields(fragment);

  return (
    <Box
      ref={elementRef}
      id={id}
      sx={{
        p: 1.5,
        bgcolor: 'white',
        borderRadius: 1,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        cursor: 'grab',
        height: '80px',
        width: '200px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#374151', fontWeight: 600, fontSize: '0.85rem' }}>
        {formatFragmentName(fragment)}
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          color: '#6B7280',
          fontSize: '0.7rem',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '2.6em'
        }}
      >
        {fields.join(' • ')}
      </Typography>
    </Box>
  );
} 