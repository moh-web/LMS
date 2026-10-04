import { useSearch, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axios';

export function VerifyEmailPage() {
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search.token;

  const { isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: async () => {
      if (!token) throw new Error('Verification token is missing.');
      const { data } = await api.post('/auth/verify-email', { token });
      return data;
    },
    enabled: !!token,
    retry: false,
  });

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 border rounded bg-white text-center shadow">
        <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Token</h2>
        <p className="text-gray-600 mb-4">No verification token was provided.</p>
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded bg-white text-center shadow">
      {isLoading && <p className="text-gray-600">Verifying email...</p>}

      {isSuccess && (
        <div>
          <div className="text-green-500 text-4xl mb-2">✓</div>
          <h2 className="text-xl font-bold mb-2">Email Verified Successfully!</h2>
          <p className="text-gray-600 text-sm mb-6">You can now sign in to your account.</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold inline-block">
            Sign In
          </Link>
        </div>
      )}

      {isError && (
        <div>
          <div className="text-red-500 text-4xl mb-2">✕</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Verification Failed</h2>
          <p className="text-gray-600 text-sm mb-6">
            {(error as any)?.response?.data?.message || 'Token is invalid or expired.'}
          </p>
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}