import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Project } from '../types';

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
  });

  const createProject = useMutation({
    mutationFn: (data: Partial<Project>) => api.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { projects, isLoading, createProject: createProject.mutate, isCreating: createProject.isPending };
}

export function useProject(id: string) {
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.getProject(id),
    enabled: !!id,
  });

  const updateProject = useMutation({
    mutationFn: (data: Partial<Project>) => api.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const analyzeProject = useMutation({
    mutationFn: () => api.analyzeProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });

  return { project, isLoading, updateProject: updateProject.mutate, isUpdating: updateProject.isPending, analyzeProject: analyzeProject.mutate, isAnalyzing: analyzeProject.isPending };
}
