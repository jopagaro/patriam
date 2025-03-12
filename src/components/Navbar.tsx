'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-light-900/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif text-light-900">Patriam</span>
              </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" exact>Home</NavLink>
            <NavLink href="/articles">Articles</NavLink>
            <NavLink href="/about">About</NavLink>
            </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
              <Link
                  href="/articles/new"
                  className="hidden md:flex px-4 py-2 text-sm text-light-900 hover:text-primary-400 transition-colors"
                >
                  Write
              </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <span className="text-sm text-light-900">{session.user?.username || 'Dashboard'}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm text-light-900 hover:text-primary-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, exact = false }: { href: string; children: React.ReactNode; exact?: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`relative px-1 py-2 text-sm transition-colors ${
        isActive ? 'text-light-900' : 'text-light-400 hover:text-light-900'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full" />
      )}
    </Link>
  );
} 