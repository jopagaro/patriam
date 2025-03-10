'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';

type BuiltInProviderType = 'credentials' | 'email' | 'oauth';

type SignInFormProps = {
  providers?: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
};

export default function SignInForm({ providers }: SignInFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/'); // Redirect to home page on success
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-200">
            Username
          </label>
          <div className="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex justify-center py-2 px-4"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-300">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300">
          Sign up
        </Link>
      </div>

      {providers && Object.values(providers).length > 0 && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-400" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-600 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {Object.values(providers).map((provider) => {
              if (provider.id === 'credentials') return null;
              
              return (
                <button
                  key={provider.id}
                  onClick={() => signIn(provider.id)}
                  className="btn-secondary flex items-center justify-center"
                >
                  {provider.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
