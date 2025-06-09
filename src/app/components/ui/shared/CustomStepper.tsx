import { Stepper, styled } from '@mui/material';

// Custom styling for the Stepper
const CustomStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    color: '#e5e7eb', // Light gray for incomplete steps
    '&.Mui-active': {
      color: '#22c55e', // Bright green for active step
    },
    '&.Mui-completed': {
      color: '#86efac', // Pastel green for completed steps
    },
  },
  '& .MuiStepConnector-line': {
    borderColor: '#e5e7eb', // Light gray for incomplete connectors
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    borderColor: '#86efac', // Pastel green for completed connectors
  },
}));

export default CustomStepper; 