'use client';

import { motion } from 'framer-motion';

interface LandingContentProps {
  onGetStarted: () => void;
}

export default function LandingContent({ onGetStarted }: LandingContentProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center z-10"
    >
      <div className="bg-[#f2f8f2] shadow-lg rounded-2xl p-12 max-w-2xl text-center h-[400px] flex flex-col justify-around">
        <h1 className="text-6xl font-bold mb-6 text-gray-800">
          Let&apos;s get Zealthy
        </h1>
        <p className="text-lg mb-8 text-gray-500">
          Experience personalized healthcare that adapts to your unique needs. 
          Join thousands of patients who have found their path to better health.
        </p>
        <button 
          onClick={onGetStarted}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200 w-40 h-12 mx-auto cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
} 