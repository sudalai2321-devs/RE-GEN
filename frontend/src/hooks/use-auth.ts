import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { LoginRequest, RegisterRequest } from '../types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => api.getMe(),
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => api.login(data),
    onSuccess: (data) => {
      api.setToken(data.access_token);
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => api.register(data),
    onSuccess: (data) => {
      api.setToken(data.access_token);
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
  });

  const logout = () => {
    api.clearToken();
    queryClient.setQueryData(['user'], null);
    router.push('/login');
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
