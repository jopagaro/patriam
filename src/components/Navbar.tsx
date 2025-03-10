'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="bg-dark-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-100">
                Patriam
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/'
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-300 hover:text-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/articles'
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-300 hover:text-gray-100'
                }`}
              >
                Articles
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/dashboard'
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-gray-300 hover:text-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {session.user.username}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-300 hover:text-gray-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-300 hover:text-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm text-gray-300 hover:text-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 