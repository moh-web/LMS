import { useAuthUser, useLogout } from '../hooks/useAuth';

export function DashboardPage() {
  const { data: user } = useAuthUser();
  const logoutMutation = useLogout();

  return (
    <div className="p-6 bg-white rounded shadow border max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => logoutMutation.mutate()}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-700">
        Welcome back, <strong>{user?.firstName} {user?.lastName}</strong> ({user?.email})!
      </p>
    </div>
  );
}