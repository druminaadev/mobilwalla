import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api/client';
import { Service } from '../types/models';
import { DEMO_SERVICES } from '../data/demo';

// Mock API Call simulating backend response
const fetchServices = async (salonId: string): Promise<Service[]> => {
  // Simulate network request
  await apiClient.get('/ping').catch(() => {}); // Dummy call to trigger latency
  
  // Return demo data
  return DEMO_SERVICES[salonId] || DEMO_SERVICES.default || [];
};

export const useServices = (salonId: string) => {
  return useQuery({
    queryKey: ['services', salonId],
    queryFn: () => fetchServices(salonId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
