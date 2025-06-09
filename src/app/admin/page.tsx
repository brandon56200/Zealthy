'use client';

import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import SettingsPanel from './components/SettingsPanel';
import LoginPlease from './components/LoginPlease';
import { useAuth } from '@/lib/auth-context';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <motion.main 
      initial={{ y: '100vh' }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className="fixed top-24 left-0 right-0 bottom-0 rounded-t-2xl bg-white"
    >
      <div className="h-full max-w-7xl mx-auto px-8 py-6">
        {!user ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <Card>
                <LoginPlease />
              </Card>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <Card>
              <SettingsPanel />
            </Card>
          </div>
        )}
      </div>
    </motion.main>
  );
} 