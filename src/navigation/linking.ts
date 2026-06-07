import { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<any> = {
  prefixes: ['salonbooking://', 'https://salonbooking.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Splash: 'splash',
          Onboarding: 'onboarding',
          Login: 'login',
          OTPVerification: 'otp',
          Permissions: 'permissions',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              Search: 'search',
              SalonList: 'salons',
              SalonDetail: 'salon/:id',
              ServiceSelection: 'salon/:id/services',
              StaffSelection: 'salon/:id/staff',
              SlotSelection: 'salon/:id/slots',
              BookingSummary: 'booking/summary',
              Payment: 'booking/payment',
              BookingSuccess: 'booking/success',
            },
          },
          BookingsTab: {
            screens: {
              BookingList: 'bookings',
              BookingDetail: 'booking/:id',
              Reschedule: 'booking/:id/reschedule',
              WriteReview: 'booking/:id/review',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              EditProfile: 'profile/edit',
              Addresses: 'profile/addresses',
              AddAddress: 'profile/addresses/add',
              Settings: 'settings',
              Notifications: 'notifications',
              Help: 'help',
              WalletHome: 'wallet',
              AddMoney: 'wallet/add',
              TransactionHistory: 'wallet/transactions',
              Referral: 'wallet/referral',
            },
          },
        },
      },
    },
  },
};
