import { Typography } from '@mui/joy';
import { CustomTextField } from '../shared/CustomTextField';
import { FormControl, MenuItem } from '@mui/material';
import { CustomSelect } from '../shared/CustomSelect';
import { CustomInputLabel } from '../shared/CustomInputLabel';
import { useState, useCallback, useEffect } from 'react';

interface PersonalInfoFragmentProps {
  onDataChange: (data: any) => void;
  initialData?: any;
}

export default function PersonalInfoFragment({ onDataChange, initialData }: PersonalInfoFragmentProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || '',
  });

  // Update form data when initialData changes
  useEffect(() => {
    console.log('PersonalInfoFragment - initialData changed:', initialData);
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        dateOfBirth: initialData.dateOfBirth || '',
        gender: initialData.gender || '',
      });
    }
  }, [initialData]);

  const handleChange = useCallback((field: string, value: string) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    onDataChange(newData);
  }, [formData, onDataChange]);

  return (
    <>
      <Typography level="h4" sx={{ mb: 2 }}>
        Personal Information
      </Typography>
      <div className="grid grid-cols-2 gap-6">
        <CustomTextField
          label="First Name"
          placeholder="Enter your first name"
          fullWidth
          size="medium"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
        />
        <CustomTextField
          label="Last Name"
          placeholder="Enter your last name"
          fullWidth
          size="medium"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
        />
        <CustomTextField
          label="Date of Birth"
          type="date"
          fullWidth
          size="medium"
          InputLabelProps={{ shrink: true }}
          value={formData.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
        />
        <FormControl fullWidth size="medium">
          <CustomInputLabel>Gender</CustomInputLabel>
          <CustomSelect
            label="Gender"
            value={formData.gender}
            onChange={(e: any) => handleChange('gender', e.target.value as string)}
          >
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
            <MenuItem value="PREFER_NOT_TO_SAY">Prefer not to say</MenuItem>
          </CustomSelect>
        </FormControl>
      </div>
    </>
  );
} 