import SignUpForm from './SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-700 to-dark-600 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center">
            <span className="font-bold text-white text-xl">P</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Join our community and start writing today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-dark-600/50 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-dark-400/30">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
} 