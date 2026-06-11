import { Booking, BookingStatus } from '../../types/models';

const DELAY = 1500;

export const bookingApi = {
  /**
   * Submits the booking to the backend.
   */
  createBooking: async (bookingData: any): Promise<Booking> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a success scenario
        resolve({
          ...bookingData,
          id: `BK${Math.floor(Math.random() * 100000)}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }, DELAY);
    });
  },

  /**
   * Fetches the user's booking history.
   */
  getBookingHistory: async (userId: string): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), DELAY); // Return empty or mock array
    });
  },

  /**
   * Cancels a booking.
   */
  cancelBooking: async (bookingId: string, reason: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), DELAY);
    });
  },

  /**
   * Reschedules a booking to a new date and time.
   */
  rescheduleBooking: async (bookingId: string, newDate: string, newTime: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), DELAY);
    });
  },
};
