'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingContent from './LandingContent';
import OnboardWizard from './OnboardWizard';

export default function HomeContent() {
  const [showWizard, setShowWizard] = useState(false);

  const handleGetStarted = () => {
    setShowWizard(true);
  };

  const handleBack = () => {
    setShowWizard(false);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!showWizard ? (
          <LandingContent key="landing" onGetStarted={handleGetStarted} />
        ) : (
          <OnboardWizard key="wizard" onBack={handleBack} />
        )}
      </AnimatePresence>
    </div>
  );
} 