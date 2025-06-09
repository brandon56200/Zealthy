import { Typography } from '@mui/joy';
import { CustomTextField } from '../shared/CustomTextField';
import { useState, useCallback } from 'react';

interface PharmacyFragmentProps {
  onDataChange: (data: any) => void;
  initialData?: any;
}

export default function PharmacyFragment({ onDataChange, initialData }: PharmacyFragmentProps) {
  const [formData, setFormData] = useState({
    pharmacyName: initialData?.pharmacyName || '',
    phoneNumber: initialData?.phoneNumber || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
  });

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
        Pharmacy Information
      </Typography>
      <div className="grid grid-cols-2 gap-4">
        <CustomTextField
          label="Pharmacy Name"
          placeholder="Enter pharmacy name"
          fullWidth
          size="medium"
          value={formData.pharmacyName}
          onChange={(e) => handleChange('pharmacyName', e.target.value)}
        />
        <CustomTextField
          label="Phone Number"
          placeholder="Enter pharmacy phone number"
          fullWidth
          size="medium"
          value={formData.phoneNumber}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
        />
        <CustomTextField
          label="Address"
          placeholder="Enter pharmacy address"
          fullWidth
          size="medium"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
        <CustomTextField
          label="City"
          placeholder="Enter pharmacy city"
          fullWidth
          size="medium"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
        <CustomTextField
          label="State"
          placeholder="Enter pharmacy state"
          fullWidth
          size="medium"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
        />
        <CustomTextField
          label="ZIP Code"
          placeholder="Enter pharmacy ZIP code"
          fullWidth
          size="medium"
          value={formData.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
        />
      </div>
    </>
  );
} 