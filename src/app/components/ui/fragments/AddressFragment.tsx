import { Typography } from '@mui/joy';
import { CustomTextField } from '../shared/CustomTextField';
import { useState, useCallback, useEffect } from 'react';

interface AddressFragmentProps {
  onDataChange: (data: any) => void;
  initialData?: any;
}

export default function AddressFragment({ onDataChange, initialData }: AddressFragmentProps) {
  const [formData, setFormData] = useState({
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
  });

  // Update form data when initialData changes
  useEffect(() => {
    console.log('AddressFragment - initialData changed:', initialData);
    if (initialData) {
      setFormData({
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
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
        Address Information
      </Typography>
      <div className="grid grid-cols-2 gap-6">
        <CustomTextField
          label="Address"
          placeholder="Enter your street address"
          fullWidth
          size="medium"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
        <CustomTextField
          label="City"
          placeholder="Enter your city"
          fullWidth
          size="medium"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
        <CustomTextField
          label="State"
          placeholder="Enter your state"
          fullWidth
          size="medium"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
        />
        <CustomTextField
          label="ZIP Code"
          placeholder="Enter your ZIP code"
          fullWidth
          size="medium"
          value={formData.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
        />
      </div>
    </>
  );
} 