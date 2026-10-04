import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, setAccessToken } from '../api/axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
}

// 1. Fetch User Profile & Handle Silent Refresh
export const useAuthUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async (): Promise<User | null> => {
      try {
        // Silent Refresh to get a new access token
        const refreshRes = await api.post('/auth/refresh');
        setAccessToken(refreshRes.data.accessToken);

        // Fetch user profile
        const { data } = await api.get('/auth/me');
        return data;
      } catch {
        setAccessToken(null);
        return null;
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: false,
  });
};

// 2. Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: any) => {
      const { data } = await api.post('/auth/login', credentials);
      setAccessToken(data.accessToken);
      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['authUser'], user);
    },
  });
};

// 3. Register Mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: async (formData: any) => {
      const { data } = await api.post('/auth/register', formData);
      return data;
    },
  });
};

// 4. Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
      setAccessToken(null);
    },
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null);
      queryClient.clear();
    },
  });
};