import { create } from 'zustand';
import { SalonService, Staff } from '@/types/models';

interface BookingState {
  salonId: string | null;
  selectedServices: SalonService[];
  selectedStaff: Staff | null;
  selectedDate: string | null;
  selectedSlot: { startTime: string; endTime: string } | null;
  
  setSalonId: (id: string) => void;
  addService: (service: SalonService) => void;
  removeService: (serviceId: string) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  setDateTime: (date: string, slot: { startTime: string; endTime: string }) => void;
  clearBooking: () => void;
  
  getTotalAmount: () => number;
  getTotalDuration: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  salonId: null,
  selectedServices: [],
  selectedStaff: null,
  selectedDate: null,
  selectedSlot: null,

  setSalonId: (id) => set({ salonId: id }),

  addService: (service) =>
    set((state) => ({
      selectedServices: [...state.selectedServices, service],
    })),

  removeService: (serviceId) =>
    set((state) => ({
      selectedServices: state.selectedServices.filter((s) => s.id !== serviceId),
    })),

  setSelectedStaff: (staff) => set({ selectedStaff: staff }),

  setDateTime: (date, slot) => set({ selectedDate: date, selectedSlot: slot }),

  clearBooking: () =>
    set({
      salonId: null,
      selectedServices: [],
      selectedStaff: null,
      selectedDate: null,
      selectedSlot: null,
    }),

  getTotalAmount: () => {
    const { selectedServices } = get();
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  },

  getTotalDuration: () => {
    const { selectedServices } = get();
    return selectedServices.reduce((sum, service) => sum + service.duration, 0);
  },
}));
