import { DEMO_BOOKINGS, DEMO_SALONS, DEMO_SERVICES, DEMO_STAFF } from '@/data/demo';
import { useBookingStore } from '@/store/bookingStore';

export function useBooking(bookingId?: string) {
  const store = useBookingStore();
  const booking = bookingId ? DEMO_BOOKINGS.find((b) => b.id === bookingId) : undefined;
  const salon = booking ? DEMO_SALONS.find((s) => s.id === booking.salonId) : undefined;
  return { booking, salon, store };
}

export function useSalon(salonId: string) {
  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const services = DEMO_SERVICES[salonId] ?? DEMO_SERVICES.default;
  const staff = DEMO_STAFF[salonId] ?? DEMO_STAFF.default;
  return { salon, services, staff };
}
