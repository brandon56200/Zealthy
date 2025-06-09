'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Step, StepLabel, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Button, Typography } from '@mui/joy';
import { useState, useRef, useEffect, useCallback } from 'react';
import LoginFragment from './fragments/LoginFragment';
import AboutMeFragment from './fragments/AboutMeFragment';
import PersonalInfoFragment from './fragments/PersonalInfoFragment';
import AddressFragment from './fragments/AddressFragment';
import PharmacyFragment from './fragments/PharmacyFragment';
import InsuranceInfoFragment from './fragments/InsuranceInfoFragment';
import CustomStepper from './shared/CustomStepper';
import { FormFragment, AdminConfig, User, Address, Pharmacy, InsuranceInfo, AboutMe } from '@/types/schema';
import { useAuth } from '@/lib/auth-context';

// Fragment mapping object
const fragmentComponents = {
  [FormFragment.ABOUT_ME]: AboutMeFragment,
  [FormFragment.PERSONAL_INFO]: PersonalInfoFragment,
  [FormFragment.ADDRESS]: AddressFragment,
  [FormFragment.PHARMACY]: PharmacyFragment,
  [FormFragment.INSURANCE_INFO]: InsuranceInfoFragment,
};

// Default admin config
const defaultAdminConfig: AdminConfig = {
  id: 'default-id',
  userId: 'default-user-id',
  stepTwoTitle: 'Personal Information',
  stepThreeTitle: 'About Me',
  stepTwoFragments: [FormFragment.PERSONAL_INFO, FormFragment.ADDRESS],
  stepThreeFragments: [FormFragment.ABOUT_ME],
  unusedFragments: [FormFragment.PHARMACY, FormFragment.INSURANCE_INFO],
  createdAt: new Date(),
  updatedAt: new Date()
};

interface OnboardWizardProps {
  onBack: () => void;
}

// Map fragment names to their camelCase equivalents
const fragmentMap: Record<FormFragment, string> = {
  [FormFragment.PERSONAL_INFO]: 'personalInfo',
  [FormFragment.ADDRESS]: 'address',
  [FormFragment.PHARMACY]: 'pharmacy',
  [FormFragment.INSURANCE_INFO]: 'insurance',
  [FormFragment.ABOUT_ME]: 'aboutMe'
};

export default function OnboardWizard({ onBack }: OnboardWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hasScroll, setHasScroll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useAuth();
  
  // Use user's admin config if available, otherwise use default
  const adminConfig = user?.adminConfig || defaultAdminConfig;

  // State for form data
  const [stepTwoData, setStepTwoData] = useState<{
    personalInfo?: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
    };
    address?: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };
    pharmacy?: {
      pharmacyName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      phoneNumber: string;
    };
    insurance?: {
      provider: string;
      policyNumber: string;
      groupNumber: string;
      startDate: string;
      endDate: string;
    };
  }>({});

  const [stepThreeData, setStepThreeData] = useState<{
    aboutMe?: Partial<AboutMe>;
    insurance?: {
      provider: string;
      policyNumber: string;
      groupNumber: string;
      startDate: string;
      endDate: string;
    };
  }>({});

  // Skip first step if user is already signed in
  useEffect(() => {
    if (user && activeStep === 0) {
      console.log('OnboardWizard - User logged in, fetching data...');
      handleLoginSuccess(user);
    }
  }, [user, activeStep]);

  // Check if content is scrollable
  const checkScroll = useCallback(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      const isScrollable = scrollHeight > clientHeight + 10; // Add small buffer to prevent false positives
      console.log('Scroll check:', {
        step: activeStep,
        scrollHeight,
        clientHeight,
        isScrollable,
        content: contentRef.current.innerHTML.length
      });
      setHasScroll(isScrollable);
    }
  }, [activeStep]);

  // Check scroll on mount and when step content changes
  useEffect(() => {
    // Wait for content to be rendered and animations to complete
    const timer = setTimeout(() => {
    checkScroll();
    }, 300); // Increased delay to ensure content is fully rendered

    return () => clearTimeout(timer);
  }, [activeStep, isLoading, stepTwoData, stepThreeData, checkScroll]);

  // Add resize listener
  useEffect(() => {
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const steps = [
    {
      title: 'Login',
      description: 'Create your account',
    },
    {
      title: adminConfig.stepTwoTitle,
      description: 'Tell us about yourself',
    },
    {
      title: adminConfig.stepThreeTitle,
      description: 'Share your health background',
    },
  ];

  const handleLoginSuccess = async (userData: any) => {
    console.log('OnboardWizard - Raw user data received:', userData);
    setUser(userData);
    setError(null);
    setIsLoading(true);

    try {
      // Fetch all user data in parallel
      const [personalInfoRes, addressRes, aboutMeRes, pharmacyRes, insuranceRes] = await Promise.all([
        fetch(`/api/users/${userData.id}/personal-info`),
        fetch(`/api/users/${userData.id}/address`),
        fetch(`/api/users/${userData.id}/about-me`),
        fetch(`/api/users/${userData.id}/pharmacy`),
        fetch(`/api/users/${userData.id}/insurance`)
      ]);

      // Log raw responses
      const responses = {
        personalInfo: await personalInfoRes.clone().json(),
        address: await addressRes.clone().json(),
        aboutMe: await aboutMeRes.clone().json(),
        pharmacy: await pharmacyRes.clone().json(),
        insurance: await insuranceRes.clone().json()
      };
      console.log('OnboardWizard - Raw API responses:', responses);

      // Initialize data objects
      const newStepTwoData: any = {};
      const newStepThreeData: any = {};

      // Process personal info
      if (personalInfoRes.ok) {
        const personalInfo = await personalInfoRes.json();
        if (personalInfo) {
          const data = {
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            dateOfBirth: new Date(personalInfo.dateOfBirth).toISOString().split('T')[0],
            gender: personalInfo.gender
          };
          if (adminConfig.stepTwoFragments.includes(FormFragment.PERSONAL_INFO)) {
            newStepTwoData.personalInfo = data;
          } else if (adminConfig.stepThreeFragments.includes(FormFragment.PERSONAL_INFO)) {
            newStepThreeData.personalInfo = data;
          }
        }
      }

      // Process address
      if (addressRes.ok) {
        const address = await addressRes.json();
        if (address) {
          const data = {
            address: address.address,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode
          };
          if (adminConfig.stepTwoFragments.includes(FormFragment.ADDRESS)) {
            newStepTwoData.address = data;
          } else if (adminConfig.stepThreeFragments.includes(FormFragment.ADDRESS)) {
            newStepThreeData.address = data;
          }
        }
      }

      // Process pharmacy
      if (pharmacyRes.ok) {
        const pharmacy = await pharmacyRes.json();
        if (pharmacy) {
          const data = {
            pharmacyName: pharmacy.pharmacyName,
            address: pharmacy.address,
            city: pharmacy.city,
            state: pharmacy.state,
            zipCode: pharmacy.zipCode,
            phoneNumber: pharmacy.phoneNumber
          };
          if (adminConfig.stepTwoFragments.includes(FormFragment.PHARMACY)) {
            newStepTwoData.pharmacy = data;
          } else if (adminConfig.stepThreeFragments.includes(FormFragment.PHARMACY)) {
            newStepThreeData.pharmacy = data;
          }
        }
      }

      // Process insurance
      if (insuranceRes.ok) {
        const insurance = await insuranceRes.json();
        if (insurance) {
          const data = {
            provider: insurance.provider,
            policyNumber: insurance.policyNumber,
            groupNumber: insurance.groupNumber,
            startDate: new Date(insurance.startDate).toISOString().split('T')[0],
            endDate: insurance.endDate ? new Date(insurance.endDate).toISOString().split('T')[0] : undefined
          };
          if (adminConfig.stepTwoFragments.includes(FormFragment.INSURANCE_INFO)) {
            newStepTwoData.insurance = data;
          } else if (adminConfig.stepThreeFragments.includes(FormFragment.INSURANCE_INFO)) {
            newStepThreeData.insurance = data;
          }
        }
      }

      // Process about me
      if (aboutMeRes.ok) {
        const aboutMe = await aboutMeRes.json();
        if (aboutMe) {
          const data = {
            healthGoals: aboutMe.healthGoals,
            lifestyle: aboutMe.lifestyle,
            healthHistory: aboutMe.healthHistory,
            preferences: aboutMe.preferences
          };
          if (adminConfig.stepTwoFragments.includes(FormFragment.ABOUT_ME)) {
            newStepTwoData.aboutMe = data;
          } else if (adminConfig.stepThreeFragments.includes(FormFragment.ABOUT_ME)) {
            newStepThreeData.aboutMe = data;
          }
        }
      }

      console.log('OnboardWizard - Final processed data:', {
        stepTwoData: newStepTwoData,
        stepThreeData: newStepThreeData
      });

      // Update state with fetched data
      setStepTwoData(newStepTwoData);
      setStepThreeData(newStepThreeData);

      // Always start at step 1 to let users review their data
      setCompletedSteps([0]);
      setActiveStep(1);

      // Force a re-render after state updates
      setTimeout(() => {
        console.log('OnboardWizard - State after update:', {
          stepTwoData: newStepTwoData,
          stepThreeData: newStepThreeData,
          activeStep: 1
        });
      }, 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error loading your saved data. Please try again.');
      setActiveStep(1);
      setCompletedSteps([0]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Login step is handled by LoginFragment
      return;
    }

    try {
      setError(null);
      const userId = user?.id;
      if (!userId) {
        setError('User ID not found. Please try logging in again.');
        return;
      }

      // Get data from the appropriate step
      const data = activeStep === 1 ? stepTwoData : stepThreeData;
      console.log(`Saving step ${activeStep} data:`, data);

      // Add detailed logging for insurance data
      const insuranceData = data.insurance;
      if (insuranceData) {
        console.log('Insurance data before sending:', {
          raw: insuranceData,
          provider: insuranceData.provider,
          policyNumber: insuranceData.policyNumber,
          groupNumber: insuranceData.groupNumber,
          startDate: insuranceData.startDate,
          endDate: insuranceData.endDate
        });
      }

      // Save the current step's data
      const response = await fetch(`/api/users/${userId}/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          step: activeStep,
          // For step 1 (0-indexed), send stepTwoData
          stepTwoData: activeStep === 1 ? data : undefined,
          // For step 2 (0-indexed), send stepThreeData
          stepThreeData: activeStep === 2 ? data : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save data');
      }

      // If this is the final step (step 2), show the thank you message
      if (activeStep === 2) {
        console.log('Final step completed, showing thank you message');
        setCompletedSteps([0, 1, 2]);
        setActiveStep(3);
      } else {
        // Otherwise, move to the next step
        setCompletedSteps(prev => [...prev, activeStep]);
        setActiveStep(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving your data');
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      setCompletedSteps((prev) => prev.filter(step => step !== activeStep - 1));
    }
  };

  const isStepCompleted = (step: number) => completedSteps.includes(step);

  const handleDataChange = useCallback((fragment: FormFragment, data: any) => {
    console.log(`Data changed for ${fragment}:`, data);
    
    if (activeStep === 1) {
      setStepTwoData(prev => {
        const newData = {
          ...prev,
          [fragmentMap[fragment]]: data
        };
        console.log('Updated stepTwoData:', newData);
        return newData;
      });
    } else if (activeStep === 2) {
      setStepThreeData(prev => {
        const newData = {
          ...prev,
          [fragmentMap[fragment]]: data
        };
        console.log('Updated stepThreeData:', newData);
        return newData;
      });
    }
  }, [activeStep]);

  // Function to render fragments based on the admin config
  const renderFragments = (fragments: FormFragment[]) => {
    console.log('OnboardWizard - Rendering fragments:', {
      fragments,
      activeStep,
      stepTwoData,
      stepThreeData,
      user
    });

    return (
      <>
        {fragments.map((fragment, index) => {
          const FragmentComponent = fragmentComponents[fragment];
          if (!FragmentComponent) return null;

          const fragmentKey = fragmentMap[fragment];
          const fragmentData = activeStep === 1 
            ? stepTwoData[fragmentKey as keyof typeof stepTwoData]
            : stepThreeData[fragmentKey as keyof typeof stepThreeData];

          console.log(`OnboardWizard - Rendering ${fragment}:`, {
            fragmentKey,
            fragmentData,
            activeStep
          });
          
          return (
            <div key={fragment} className={index > 0 ? 'mt-8' : ''}>
              <FragmentComponent 
                onDataChange={(data) => handleDataChange(fragment, data)}
                initialData={fragmentData}
              />
            </div>
          );
        })}
      </>
    );
  };

  const renderStepContent = (step: number) => {
    console.log('Rendering step content for step:', step);
    switch (step) {
      case 0:
        return <LoginFragment onLoginSuccess={handleLoginSuccess} onError={setError} />;
      case 1:
        return renderFragments(adminConfig.stepTwoFragments);
      case 2:
        return renderFragments(adminConfig.stepThreeFragments);
      case 3:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md text-center"
            >
              <Typography level="h3" className="mb-6 text-gray-800">
                Thank You for Registering!
              </Typography>
              <Typography level="body-lg" className="text-gray-600">
                Your account has been successfully created. We're excited to have you on board!
              </Typography>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center z-10"
    >
      <div className="bg-[#fafafa] shadow-lg rounded-2xl p-12 max-w-[1000px] w-full mx-[40px] h-[600px] relative flex flex-col">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <CustomStepper 
            activeStep={activeStep}
            alternativeLabel
            sx={{ 
              width: '100%', 
              maxWidth: '800px',
            }}
          >
            {steps.map((step, index) => (
              <Step key={index} completed={isStepCompleted(index)}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </CustomStepper>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6" ref={contentRef}>
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className={activeStep === 0 ? '' : 'h-full'}
        >
          {renderStepContent(activeStep)}
                </motion.div>
              </AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-center"
                >
                  <Typography color="danger" level="body-sm">
                    {error}
                  </Typography>
                </motion.div>
              )}
            </>
          )}
        </div>

        <AnimatePresence>
          {hasScroll && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeStep < 3 && (
        <div className="flex justify-between mt-6 px-4">
            {activeStep > 0 && (
          <Button
            size="lg"
            variant="outlined"
            onClick={handleBack}
            sx={{
              borderColor: '#22c55e',
              color: '#22c55e',
              '&:hover': {
                borderColor: '#16a34a',
                backgroundColor: 'rgba(34, 197, 94, 0.04)',
              },
            }}
          >
            Previous
          </Button>
            )}
          <Button
            size="lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activeStep === 0) {
                  // Find and submit the login form
                  const form = document.querySelector('form');
                  if (form) {
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
                } else {
                  handleNext();
                }
              }}
              disabled={false}
            sx={{
              backgroundColor: '#22c55e',
              '&:hover': {
                backgroundColor: '#16a34a',
              },
                ...(activeStep === 0 && { marginLeft: 'auto' })
            }}
          >
              {activeStep === 0 ? 'Login/Register' : activeStep === 2 ? 'Finish' : 'Next Step'}
          </Button>
        </div>
        )}
      </div>
    </motion.div>
  );
} 