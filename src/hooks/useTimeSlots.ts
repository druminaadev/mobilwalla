import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api/client';
import { TimeSlot } from '../types/models';

// Mock API Call simulating backend response
const fetchTimeSlots = async (salonId: string, staffId: string | null, date: string): Promise<TimeSlot[]> => {
  // Simulate network request
  await apiClient.get('/ping').catch(() => {});
  
  // Generate slots from 09:00 to 19:30
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 19;
  
  for (let h = startHour; h <= endHour; h++) {
    for (let m of [0, 30]) {
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      
      // Randomly make some slots unavailable to simulate reality (deterministic based on date & time string)
      const isBooked = (timeStr.charCodeAt(0) + timeStr.charCodeAt(4) + date.charCodeAt(date.length - 1)) % 5 === 0;

      slots.push({
        id: `ts-${timeStr}`,
        time: timeStr,
        isAvailable: !isBooked,
        isPast: false
      });
    }
  }

  return slots;
};

export const useTimeSlots = (salonId: string, staffId: string | null, date: string) => {
  return useQuery({
    queryKey: ['timeSlots', salonId, staffId, date],
    queryFn: () => fetchTimeSlots(salonId, staffId, date),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
