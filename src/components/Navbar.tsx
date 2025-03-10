'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-900/95 backdrop-blur-sm' : 'bg-dark-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 border-b border-dark-700">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-serif font-bold text-light-900 hover:text-light-700">
              PATRIAM
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/articles"
              className={`text-sm tracking-wide ${
                pathname === '/articles'
                  ? 'text-light-900'
                  : 'text-light-300 hover:text-light-900 transition-colors'
              }`}
            >
              ARTICLES
            </Link>
            {session?.user?.role === 'writer' && (
              <Link
                href="/dashboard"
                className={`text-sm tracking-wide ${
                  pathname === '/dashboard'
                    ? 'text-light-900'
                    : 'text-light-300 hover:text-light-900 transition-colors'
                }`}
              >
                DASHBOARD
              </Link>
            )}
            {session?.user ? (
              <div className="flex items-center space-x-8">
                <span className="text-sm tracking-wide text-light-300">
                  {session.user.username?.toUpperCase()}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm tracking-wide text-light-300 hover:text-light-900 transition-colors"
                >
                  SIGN OUT
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-8">
                <Link
                  href="/auth/signin"
                  className="text-sm tracking-wide text-light-300 hover:text-light-900 transition-colors"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm tracking-wide text-light-300 hover:text-light-900 transition-colors"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-light-300 hover:text-light-900"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
} 