import { Typography } from '@mui/joy';
import { CustomTextField } from '../shared/CustomTextField';
import { useState, useCallback, useEffect } from 'react';

interface AboutMeFragmentProps {
  onDataChange: (data: any) => void;
  initialData?: any;
}

export default function AboutMeFragment({ onDataChange, initialData }: AboutMeFragmentProps) {
  const [formData, setFormData] = useState({
    healthGoals: initialData?.healthGoals || '',
    lifestyle: initialData?.lifestyle || '',
    healthHistory: initialData?.healthHistory || '',
    preferences: initialData?.preferences || '',
  });

  // Update form data when initialData changes
  useEffect(() => {
    console.log('AboutMeFragment - initialData changed:', initialData);
    if (initialData) {
      setFormData({
        healthGoals: initialData.healthGoals || '',
        lifestyle: initialData.lifestyle || '',
        healthHistory: initialData.healthHistory || '',
        preferences: initialData.preferences || '',
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
        About Me
      </Typography>
      <div className="grid grid-cols-2 gap-6">
        <CustomTextField
          label="Health Goals"
          placeholder="What are your main health goals?"
          fullWidth
          size="medium"
          multiline
          rows={3}
          value={formData.healthGoals}
          onChange={(e) => handleChange('healthGoals', e.target.value)}
        />
        <CustomTextField
          label="Lifestyle"
          placeholder="Tell us about your daily lifestyle and routines"
          fullWidth
          size="medium"
          multiline
          rows={3}
          value={formData.lifestyle}
          onChange={(e) => handleChange('lifestyle', e.target.value)}
        />
        <CustomTextField
          label="Health History"
          placeholder="Share your health journey and any significant events"
          fullWidth
          size="medium"
          multiline
          rows={3}
          value={formData.healthHistory}
          onChange={(e) => handleChange('healthHistory', e.target.value)}
        />
        <CustomTextField
          label="Preferences"
          placeholder="Any specific preferences or requirements for your healthcare?"
          fullWidth
          size="medium"
          multiline
          rows={3}
          value={formData.preferences}
          onChange={(e) => handleChange('preferences', e.target.value)}
        />
      </div>
    </>
  );
} 