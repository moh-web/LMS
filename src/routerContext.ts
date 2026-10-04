import { QueryClient } from '@tanstack/react-query';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
}

export interface RouterContext {
  queryClient: QueryClient;
  auth: {
    user: User | null;
    isLoading: boolean;
  };
}
