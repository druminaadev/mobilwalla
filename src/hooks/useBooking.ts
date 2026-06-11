import { useState } from 'react';
import { bookingApi } from '../services/api/bookingApi';
import { Booking } from '../types/models';
import { useBookingStore } from '../store/bookingStore';

export function useBooking() {
  const store = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBooking = async (): Promise<Booking | null> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const bookingData = {
        salonId: store.salonId,
        salonName: store.salonName,
        salonImage: store.salonImage,
        services: store.services,
        staff: store.staff,
        date: store.date,
        time: store.timeSlot?.time,
        totalAmount: store.getTotal(),
        discountAmount: store.getDiscount(),
        couponCode: store.coupon?.code,
        specialInstructions: store.specialInstructions,
      };

      const result = await bookingApi.createBooking(bookingData);
      
      // On success, reset the store
      store.resetBooking();
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelBooking = async (bookingId: string, reason: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await bookingApi.cancelBooking(bookingId, reason);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const rescheduleBooking = async (bookingId: string, date: string, time: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await bookingApi.rescheduleBooking(bookingId, date, time);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule booking');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitBooking,
    cancelBooking,
    rescheduleBooking,
    isSubmitting,
    error,
    store,
  };
}
