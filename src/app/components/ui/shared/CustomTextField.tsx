import { styled, TextField } from '@mui/material';

export const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#22c55e',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#22c55e',
  },
  '& .MuiSelect-icon': {
    color: '#22c55e',
  },
}); 