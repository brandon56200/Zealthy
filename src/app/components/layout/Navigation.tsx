'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginButton from './LoginButton';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center z-50">
      <nav className="my-[20px] bg-white/30 backdrop-blur-sm shadow-sm rounded-full h-12 max-w-[1000px] w-full mx-[40px] border border-white/20">
        <div className="h-full px-8">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section - Left */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-extrabold text-gray-800 font-noto-sans">
                Zealthy
              </Link>
            </div>

            {/* Navigation Links - Center */}
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`${
                  isActive('/')
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                href="/data"
                className={`${
                  isActive('/data')
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Data
              </Link>
              <Link
                href="/admin"
                className={`${
                  isActive('/admin')
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Admin
              </Link>
            </div>

            {/* Login Button - Right */}
            <div className="flex-shrink-0">
              <LoginButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
} 