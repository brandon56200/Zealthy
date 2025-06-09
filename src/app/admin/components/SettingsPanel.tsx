'use client';

import { Box, Typography, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AdminConfig, FormFragment } from '@/types/schema';
import FragmentContainer from './FragmentContainer';

export default function SettingsPanel() {
  const { user, adminConfig, updateAdminConfig } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stepTwoTitle, setStepTwoTitle] = useState('');
  const [stepThreeTitle, setStepThreeTitle] = useState('');

  useEffect(() => {
    const fetchAdminConfig = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/users/${user.id}/admin-config`);
        if (!response.ok) throw new Error('Failed to fetch admin config');
        const data = await response.json();
        updateAdminConfig(data);
        setStepTwoTitle(data.stepTwoTitle);
        setStepThreeTitle(data.stepThreeTitle);
      } catch (error) {
        console.error('Error fetching admin config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminConfig();
  }, [user?.id]);

  const handleTitleChange = async (step: 'stepTwo' | 'stepThree', newTitle: string) => {
    if (!adminConfig || !user?.id) return;

    const newConfig = { ...adminConfig };
    if (step === 'stepTwo') {
      newConfig.stepTwoTitle = newTitle;
    } else {
      newConfig.stepThreeTitle = newTitle;
    }

    // Update state immediately for responsive UI
    updateAdminConfig(newConfig);

    // Update backend asynchronously
    try {
      const response = await fetch(`/api/users/${user.id}/admin-config`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });

      if (!response.ok) throw new Error('Failed to update admin config');
    } catch (error) {
      console.error('Error updating admin config:', error);
    }
  };

  const handleDrop = async (fragment: FormFragment, targetId: string) => {
    if (!adminConfig || !user?.id) return;

    const newConfig = { ...adminConfig };
    const sourceId = Object.entries({
      unused: adminConfig.unusedFragments,
      stepTwo: adminConfig.stepTwoFragments,
      stepThree: adminConfig.stepThreeFragments,
    }).find(([_, fragments]) => fragments.includes(fragment))?.[0];

    if (!sourceId) return;

    // Prevent removing the last fragment from Step 2 or Step 3
    if ((sourceId === 'stepTwo' && newConfig.stepTwoFragments.length === 1) ||
        (sourceId === 'stepThree' && newConfig.stepThreeFragments.length === 1)) {
      return;
    }

    // Remove from source
    switch (sourceId) {
      case 'unused':
        newConfig.unusedFragments = newConfig.unusedFragments.filter(f => f !== fragment);
        break;
      case 'stepTwo':
        newConfig.stepTwoFragments = newConfig.stepTwoFragments.filter(f => f !== fragment);
        break;
      case 'stepThree':
        newConfig.stepThreeFragments = newConfig.stepThreeFragments.filter(f => f !== fragment);
        break;
    }

    // Add to target
    switch (targetId) {
      case 'unused':
        newConfig.unusedFragments.push(fragment);
        break;
      case 'stepTwo':
        newConfig.stepTwoFragments.push(fragment);
        break;
      case 'stepThree':
        newConfig.stepThreeFragments.push(fragment);
        break;
    }

    // Update state immediately for responsive UI
    updateAdminConfig(newConfig);

    // Update backend asynchronously
    try {
      const response = await fetch(`/api/users/${user.id}/admin-config`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });

      if (!response.ok) throw new Error('Failed to update admin config');
    } catch (error) {
      console.error('Error updating admin config:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!adminConfig) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Error loading configuration</Typography>
      </Box>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* Unused Fragments */}
        <div style={{ 
          background: '#33c464',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <FragmentContainer
            title="Unused Fragments"
            fragments={adminConfig.unusedFragments}
            id="unused"
            onDrop={(fragment) => handleDrop(fragment, 'unused')}
            containerStyle={{
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '8px',
              alignItems: 'flex-start',
            }}
          />
        </div>

        {/* Step Containers */}
        <div className="flex justify-around">
          {/* Step 1 - Login (Fixed) */}
          <div style={{ width: '310px' }}>
            <FragmentContainer
              title="Step 1 - Login"
              fragments={[]}
              id="stepOne"
              onDrop={() => {}} // No-op since Step 1 is not modifiable
              containerStyle={{
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '12px',
                alignItems: 'center',
              }}
            >
              <Box sx={{ 
                p: 1.5, 
                bgcolor: 'white', 
                borderRadius: 1, 
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                minHeight: '70px',
                width: '200px',
                border: '1px solid #E5E7EB'
              }}>
                <Typography variant="subtitle2" sx={{ color: '#374151', fontWeight: 600, fontSize: '0.85rem' }}>
                  Login Fragment
                </Typography>
              </Box>
            </FragmentContainer>
          </div>

          {/* Step 2 */}
          <div style={{ width: '310px' }}>
            <div style={{ 
              background: '#33c464',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <FragmentContainer
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>
                      Step 2 -
                    </Typography>
                    <TextField
                      value={stepTwoTitle}
                      onChange={(e) => setStepTwoTitle(e.target.value)}
                      onBlur={() => handleTitleChange('stepTwo', stepTwoTitle)}
                      variant="outlined"
                      size="small"
                      placeholder="Enter step title"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          padding: '4px 8px',
                        },
                        '& .MuiOutlinedInput-root': {
                          width: '200px',
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255,255,255,0.7)',
                          },
                        },
                      }}
                    />
                  </Box>
                }
                fragments={adminConfig.stepTwoFragments}
                id="stepTwo"
                onDrop={(fragment) => handleDrop(fragment, 'stepTwo')}
                containerStyle={{
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '12px',
                  alignItems: 'center',
                }}
              />
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ width: '310px' }}>
            <div style={{ 
              background: '#33c464',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <FragmentContainer
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>
                      Step 3 -
                    </Typography>
                    <TextField
                      value={stepThreeTitle}
                      onChange={(e) => setStepThreeTitle(e.target.value)}
                      onBlur={() => handleTitleChange('stepThree', stepThreeTitle)}
                      variant="outlined"
                      size="small"
                      placeholder="Enter step title"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          padding: '4px 8px',
                        },
                        '& .MuiOutlinedInput-root': {
                          width: '200px',
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255,255,255,0.7)',
                          },
                        },
                      }}
                    />
                  </Box>
                }
                fragments={adminConfig.stepThreeFragments}
                id="stepThree"
                onDrop={(fragment) => handleDrop(fragment, 'stepThree')}
                containerStyle={{
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '12px',
                  alignItems: 'center',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 