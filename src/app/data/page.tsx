'use client';

import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import DataDisplay from './components/DataDisplay';
import StatsBar from './components/StatsBar';

export default function DataPage() {
  return (
    <motion.main 
      initial={{ y: '100vh' }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className="fixed top-24 left-0 right-0 bottom-0 bg-white rounded-t-2xl overflow-hidden"
    >
      <div className="h-full max-w-7xl mx-auto px-8 py-6 flex flex-col">
        <StatsBar />
        <div className="flex-1 overflow-hidden">
          <DataDisplay />
        </div>
      </div>
    </motion.main>
  );
} 