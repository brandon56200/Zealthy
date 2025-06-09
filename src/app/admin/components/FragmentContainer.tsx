'use client';

import { Box, Typography } from '@mui/material';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { FormFragment } from '@/types/schema';
import { ReactNode, useRef, useEffect } from 'react';
import FragmentCard from './FragmentCard';

interface FragmentContainerProps {
  title: string | ReactNode;
  fragments: FormFragment[];
  id: string;
  onDrop: (fragment: FormFragment) => void;
  children?: ReactNode;
  containerStyle?: React.CSSProperties;
}

export default function FragmentContainer({ 
  title, 
  fragments, 
  id, 
  onDrop,
  children,
  containerStyle
}: FragmentContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isStepContainer = id.startsWith('step');
  const isStepOne = id === 'stepOne';
  const isUnused = id === 'unused';

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = dropTargetForElements({
      element: containerRef.current,
      getData: () => ({ id }),
      onDrag: ({ source }) => {
        const data = source.data as { fragment: FormFragment };
        if (data.fragment) {
          onDrop(data.fragment);
        }
      },
    });

    return cleanup;
  }, [id, onDrop]);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${isStepOne ? 'bg-[rgba(31,41,55,0.9)]' : ''}`}>
      <div className={`px-3 py-2 ${isStepOne ? 'bg-[rgba(31,41,55,0.9)]' : ''}`}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: isStepOne ? '#E5E7EB' : 'white', 
            fontWeight: 500, 
            fontSize: '0.95rem' 
          }}
        >
          {title}{isStepOne ? ' (Read-Only)' : ''}
        </Typography>
      </div>
      <Box
        ref={containerRef}
        sx={{
          bgcolor: isStepOne ? 'rgba(31,41,55,0.9)' : '#F8FAFC',
          minHeight: '80px',
          p: 1.5,
          borderTop: isStepOne ? 'none' : '1px solid #E5E7EB',
          ...containerStyle
        }}
      >
        {children || (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isStepContainer ? 'column' : 'row',
            flexWrap: isStepContainer ? 'nowrap' : 'wrap',
            gap: 1.5,
            alignItems: isStepContainer ? 'center' : 'flex-start',
            width: '100%'
          }}>
            {fragments.map((fragment, index) => (
              <FragmentCard
                key={`${id}-${fragment}-${index}`}
                fragment={fragment}
                id={`${id}-${fragment}-${index}`}
              />
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
} 