import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-dark-800 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {error === 'Configuration' && (
              <>There is a problem with the server configuration.</>
            )}
            {error === 'AccessDenied' && (
              <>You do not have permission to sign in.</>
            )}
            {error === 'Verification' && (
              <>The sign in link is no longer valid.</>
            )}
            {!error && <>An error occurred during authentication.</>}
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/auth/signin"
            className="text-primary-400 hover:text-primary-300"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 