import { Typography } from '@mui/joy';
import { CustomTextField } from '../shared/CustomTextField';
import { useState, useCallback } from 'react';

interface InsuranceInfoFragmentProps {
  onDataChange: (data: any) => void;
  initialData?: any;
}

export default function InsuranceInfoFragment({ onDataChange, initialData }: InsuranceInfoFragmentProps) {
  const [formData, setFormData] = useState({
    provider: initialData?.provider || '',
    policyNumber: initialData?.policyNumber || '',
    groupNumber: initialData?.groupNumber || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
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
        Insurance Information
      </Typography>
      <div className="grid grid-cols-2 gap-4">
        <CustomTextField
          label="Provider"
          placeholder="Enter insurance provider"
          fullWidth
          size="medium"
          value={formData.provider}
          onChange={(e) => handleChange('provider', e.target.value)}
        />
        <CustomTextField
          label="Policy Number"
          placeholder="Enter policy number"
          fullWidth
          size="medium"
          value={formData.policyNumber}
          onChange={(e) => handleChange('policyNumber', e.target.value)}
        />
        <CustomTextField
          label="Group Number"
          placeholder="Enter group number (optional)"
          fullWidth
          size="medium"
          value={formData.groupNumber}
          onChange={(e) => handleChange('groupNumber', e.target.value)}
        />
        <CustomTextField
          label="Start Date"
          type="date"
          fullWidth
          size="medium"
          InputLabelProps={{ shrink: true }}
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
        <CustomTextField
          label="End Date"
          type="date"
          fullWidth
          size="medium"
          InputLabelProps={{ shrink: true }}
          value={formData.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>
    </>
  );
} 