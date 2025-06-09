import { Select, styled } from '@mui/material';

const CustomSelect = styled(Select)({
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#22c55e',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#22c55e',
  },
  '& .MuiSelect-icon': {
    color: '#22c55e',
  },
});

export { CustomSelect }; 