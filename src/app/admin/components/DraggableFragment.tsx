'use client';

import { Box, Typography } from '@mui/material';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { FormFragment } from '@/types/schema';
import { useRef, useEffect } from 'react';

interface DraggableFragmentProps {
  fragment: FormFragment;
  id: string;
}

export default function DraggableFragment({ fragment, id }: DraggableFragmentProps) {
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

  return (
    <Box
      ref={elementRef}
      id={id}
      sx={{
        p: 2,
        bgcolor: 'white',
        borderRadius: 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'grab',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Typography variant="body1" sx={{ color: '#374151' }}>
        {fragment}
      </Typography>
    </Box>
  );
} 