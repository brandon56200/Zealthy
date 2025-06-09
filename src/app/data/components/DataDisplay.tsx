'use client';

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  personalInfo?: {
    firstName: string;
    lastName: string;
  } | null;
}

interface AboutMe {
  id: string;
  healthGoals: string;
  lifestyle: string;
  healthHistory: string;
  preferences: string;
  user: {
    email: string;
  };
}

interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  user: {
    email: string;
  };
}

interface AdminConfig {
  id: string;
  stepTwoTitle: string;
  stepTwoFragments: string[];
  stepThreeTitle: string;
  stepThreeFragments: string[];
  user: {
    email: string;
  };
}

interface InsuranceInfo {
  id: string;
  provider: string;
  policyNumber: string;
  groupNumber: string;
  user: {
    email: string;
  };
}

interface PersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  user: {
    email: string;
  };
}

interface Pharmacy {
  id: string;
  pharmacyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  user: {
    email: string;
  };
}

interface DataResponse {
  users: User[];
  aboutMe: AboutMe[];
  addresses: Address[];
  adminConfigs: AdminConfig[];
  insuranceInfo: InsuranceInfo[];
  personalInfo: PersonalInfo[];
  pharmacies: Pharmacy[];
}

const truncateText = (text: string, maxLength: number = 30) => {
  if (!text) return 'N/A';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

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

const tableCardStyle = {
  p: 2,
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: 2,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  height: '400px',
  display: 'flex',
  flexDirection: 'column' as const,
  width: '100%',
  mb: 3,
};

const tableContainerStyle = {
  flex: 1,
  overflowX: 'auto',
  overflowY: 'hidden',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
};

const tableCellStyle = {
  minWidth: '150px',
  whiteSpace: 'nowrap' as const,
};

const LoadingTable = () => (
  <Paper elevation={0} sx={tableCardStyle}>
    <Box sx={{ ...shimmerStyle, height: '32px', width: '200px', borderRadius: '4px', mb: 2 }} />
    <TableContainer sx={tableContainerStyle}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableCell key={i} sx={tableCellStyle}>
                <Box sx={{ ...shimmerStyle, height: '24px', width: '100%', borderRadius: '4px' }} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5].map((row) => (
            <TableRow key={row}>
              {[1, 2, 3, 4, 5].map((cell) => (
                <TableCell key={cell} sx={tableCellStyle}>
                  <Box sx={{ ...shimmerStyle, height: '24px', width: '100%', borderRadius: '4px' }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default function DataDisplay() {
  const [data, setData] = useState<DataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/users/data?limit=5');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const responseData = await response.json();
        console.log('Fetched data:', responseData); // Debug log
        setData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set minimum loading time
    const minLoadingTimer = setTimeout(() => {
      setMinLoadingComplete(true);
    }, 1000);

    fetchData();

    return () => clearTimeout(minLoadingTimer);
  }, []);

  const formatName = (user: { personalInfo?: { firstName: string; lastName: string } | null }) => {
    if (!user.personalInfo) return 'N/A';
    return `${user.personalInfo.firstName} ${user.personalInfo.lastName}`;
  };

  if (loading || !data || !minLoadingComplete) {
    return (
      <Box 
        sx={{ 
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#555',
            },
          },
        }}
      >
        <Box sx={{ p: 2, maxWidth: '100%' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <LoadingTable key={i} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}
    >
      <Box sx={{ p: 2, maxWidth: '100%' }}>
        {/* Users Table */}
        <Paper elevation={0} sx={tableCardStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>Users</Typography>
          <TableContainer sx={tableContainerStyle}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableCellStyle}>Email</TableCell>
                  <TableCell sx={tableCellStyle}>Name</TableCell>
                  <TableCell sx={tableCellStyle}>Created At</TableCell>
                  <TableCell sx={tableCellStyle}>Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.users || []).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell sx={tableCellStyle}>{user.email}</TableCell>
                    <TableCell sx={tableCellStyle}>{formatName(user)}</TableCell>
                    <TableCell sx={tableCellStyle}>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={tableCellStyle}>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* About Me */}
        <Paper elevation={0} sx={tableCardStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>About Me</Typography>
          <TableContainer sx={tableContainerStyle}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableCellStyle}>Email</TableCell>
                  <TableCell sx={tableCellStyle}>Health Goals</TableCell>
                  <TableCell sx={tableCellStyle}>Lifestyle</TableCell>
                  <TableCell sx={tableCellStyle}>Health History</TableCell>
                  <TableCell sx={tableCellStyle}>Preferences</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.aboutMe || []).map((info) => (
                  <TableRow key={info.id}>
                    <TableCell sx={tableCellStyle}>{info.user.email}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(info.healthGoals)}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(info.lifestyle)}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(info.healthHistory)}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(info.preferences)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Address */}
        <Paper elevation={0} sx={tableCardStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>Address</Typography>
          <TableContainer sx={tableContainerStyle}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableCellStyle}>Email</TableCell>
                  <TableCell sx={tableCellStyle}>Address</TableCell>
                  <TableCell sx={tableCellStyle}>City</TableCell>
                  <TableCell sx={tableCellStyle}>State</TableCell>
                  <TableCell sx={tableCellStyle}>Zip</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.addresses || []).map((address) => (
                  <TableRow key={address.id}>
                    <TableCell sx={tableCellStyle}>{address.user.email}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(address.address)}</TableCell>
                    <TableCell sx={tableCellStyle}>{address.city}</TableCell>
                    <TableCell sx={tableCellStyle}>{address.state}</TableCell>
                    <TableCell sx={tableCellStyle}>{address.zipCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Admin Config */}
        <Paper elevation={0} sx={tableCardStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>Admin Config</Typography>
          <TableContainer sx={tableContainerStyle}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableCellStyle}>Email</TableCell>
                  <TableCell sx={tableCellStyle}>Step Two Title</TableCell>
                  <TableCell sx={tableCellStyle}>Step Two Fragments</TableCell>
                  <TableCell sx={tableCellStyle}>Step Three Title</TableCell>
                  <TableCell sx={tableCellStyle}>Step Three Fragments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.adminConfigs || []).map((config) => (
                  <TableRow key={config.id}>
                    <TableCell sx={tableCellStyle}>{config.user.email}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(config.stepTwoTitle)}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(config.stepTwoFragments.join(', '))}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(config.stepThreeTitle)}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(config.stepThreeFragments.join(', '))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Insurance Info */}
        <Paper elevation={0} sx={tableCardStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>Insurance Info</Typography>
          <TableContainer sx={tableContainerStyle}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableCellStyle}>Email</TableCell>
                  <TableCell sx={tableCellStyle}>Provider</TableCell>
                  <TableCell sx={tableCellStyle}>Policy #</TableCell>
                  <TableCell sx={tableCellStyle}>Group #</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.insuranceInfo || []).map((info) => (
                  <TableRow key={info.id}>
                    <TableCell sx={tableCellStyle}>{info.user.email}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(info.provider)}</TableCell>
                    <TableCell sx={tableCellStyle}>{info.policyNumber}</TableCell>
                    <TableCell sx={tableCellStyle}>{info.groupNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Personal Info */}
        <Paper elevation={0} sx={tableCardStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>Personal Info</Typography>
          <TableContainer sx={tableContainerStyle}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableCellStyle}>Email</TableCell>
                  <TableCell sx={tableCellStyle}>First Name</TableCell>
                  <TableCell sx={tableCellStyle}>Last Name</TableCell>
                  <TableCell sx={tableCellStyle}>DOB</TableCell>
                  <TableCell sx={tableCellStyle}>Gender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.personalInfo || []).map((info) => (
                  <TableRow key={info.id}>
                    <TableCell sx={tableCellStyle}>{info.user.email}</TableCell>
                    <TableCell sx={tableCellStyle}>{info.firstName}</TableCell>
                    <TableCell sx={tableCellStyle}>{info.lastName}</TableCell>
                    <TableCell sx={tableCellStyle}>{new Date(info.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell sx={tableCellStyle}>{info.gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pharmacy */}
        <Paper elevation={0} sx={tableCardStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>Pharmacy</Typography>
          <TableContainer sx={tableContainerStyle}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableCellStyle}>Email</TableCell>
                  <TableCell sx={tableCellStyle}>Pharmacy</TableCell>
                  <TableCell sx={tableCellStyle}>Address</TableCell>
                  <TableCell sx={tableCellStyle}>City</TableCell>
                  <TableCell sx={tableCellStyle}>State</TableCell>
                  <TableCell sx={tableCellStyle}>Zip</TableCell>
                  <TableCell sx={tableCellStyle}>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.pharmacies || []).map((pharmacy) => (
                  <TableRow key={pharmacy.id}>
                    <TableCell sx={tableCellStyle}>{pharmacy.user.email}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(pharmacy.pharmacyName)}</TableCell>
                    <TableCell sx={tableCellStyle}>{truncateText(pharmacy.address)}</TableCell>
                    <TableCell sx={tableCellStyle}>{pharmacy.city}</TableCell>
                    <TableCell sx={tableCellStyle}>{pharmacy.state}</TableCell>
                    <TableCell sx={tableCellStyle}>{pharmacy.zipCode}</TableCell>
                    <TableCell sx={tableCellStyle}>{pharmacy.phoneNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
} 