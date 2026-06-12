import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api/client';
import { Staff } from '../types/models';
import { DEMO_STAFF } from '../data/demo';

// Mock API Call simulating backend response
const fetchStaff = async (salonId: string): Promise<Staff[]> => {
  // Simulate network request
  await apiClient.get('/ping').catch(() => {});
  
  // Return demo data based on salonId
  return DEMO_STAFF[salonId] || DEMO_STAFF.default || [];
};

export const useStaff = (salonId: string) => {
  return useQuery({
    queryKey: ['staff', salonId],
    queryFn: () => fetchStaff(salonId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
