import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Opportunity } from '../types';

export function useOpportunities(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['opportunities', params],
    queryFn: () => api.getOpportunities(params),
  });
}

export function useProjectOpportunities(projectId: string) {
  const queryClient = useQueryClient();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['project', projectId, 'opportunities'],
    queryFn: () => api.getProjectOpportunities(projectId),
    enabled: !!projectId,
  });

  const discover = useMutation({
    mutationFn: () => api.discoverOpportunities(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId, 'opportunities'] });
    },
  });

  return { opportunities, isLoading, discover: discover.mutate, isDiscovering: discover.isPending };
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => api.getOpportunity(id),
    enabled: !!id,
  });
}
