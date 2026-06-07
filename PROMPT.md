You are a Senior React Native Architect and Product Designer.

I already have a React Native + Expo + TypeScript salon booking application with the following modules:

- Authentication (Phone + OTP)
- Home
- Salon Discovery
- Services Catalog
- Booking Wizard
- Payments
- Wallet
- Bookings Management
- Notifications
- Profile

Tech Stack:
- React Native 0.81+
- Expo 54+
- TypeScript
- Zustand
- React Navigation
- Axios
- AsyncStorage
- Firebase Push Notifications
- Razorpay

Your task is to upgrade the application into a complete production-ready salon booking platform.

IMPORTANT:
- Do not remove existing functionality.
- Follow existing project architecture.
- Use TypeScript everywhere.
- Follow clean architecture.
- Create reusable components.
- Follow mobile-first UI/UX.
- Generate production-level code structure.
- Generate screen files, navigation updates, Zustand stores, API contracts, TypeScript models, and UI components.

--------------------------------------------------
PHASE 1 — CUSTOMER EXPERIENCE IMPROVEMENTS
--------------------------------------------------

Create the following modules:

1. FAVORITES MODULE

Screens:
- FavoriteSalonsScreen
- FavoriteServicesScreen

Features:
- Add salon to favorites
- Remove salon from favorites
- Add service to favorites
- Favorite badge on salon cards
- Quick booking from favorites
- Sync with backend

Store:
- favoritesStore.ts

API:
GET /favorites
POST /favorites
DELETE /favorites/:id

--------------------------------------------------

2. OFFERS & COUPONS MODULE

Screens:
- OffersScreen
- CouponDetailsScreen
- ApplyCouponModal

Features:
- Coupon listing
- Auto-apply best coupon
- Coupon validation
- First booking discount
- Referral discount
- Festival offers
- Salon-specific offers

Store:
- couponStore.ts

API:
GET /offers
POST /coupon/validate

--------------------------------------------------

3. MEMBERSHIP MODULE

Screens:
- MembershipScreen
- MembershipPlanDetailsScreen
- MembershipBenefitsScreen

Plans:
- Silver
- Gold
- Platinum

Features:
- Membership purchase
- Membership renewal
- Membership discounts
- Priority booking
- Free services

API:
GET /memberships
POST /memberships/purchase

--------------------------------------------------

4. REWARD POINTS SYSTEM

Screens:
- RewardsScreen
- LoyaltyPointsScreen
- RewardHistoryScreen

Features:
- Earn points per booking
- Redeem points
- Cashback rewards
- Reward history

API:
GET /rewards
POST /rewards/redeem

--------------------------------------------------
PHASE 2 — SALON EXPERIENCE
--------------------------------------------------

5. STAFF PROFILE MODULE

Screens:
- StaffProfileScreen

Features:
- Experience
- Skills
- Certifications
- Ratings
- Reviews
- Portfolio
- Available slots

API:
GET /staff/:id

--------------------------------------------------

6. SALON GALLERY MODULE

Screens:
- SalonGalleryScreen
- ImagePreviewScreen

Features:
- Full-screen gallery
- Before/After photos
- Staff portfolio
- Zoom support
- Lazy image loading

--------------------------------------------------

7. MAPS & LOCATION MODULE

Screens:
- MapScreen
- SalonDirectionScreen

Features:
- Google Maps integration
- Nearby salons
- Distance calculation
- Open in Google Maps
- Route navigation

API:
GET /salons/nearby

--------------------------------------------------
PHASE 3 — ADVANCED BOOKING FEATURES
--------------------------------------------------

8. PACKAGE BOOKING

Screens:
- PackageListingScreen
- PackageDetailsScreen

Examples:
- Bridal Package
- Hair Care Package
- Premium Grooming Package

Features:
- Package pricing
- Package duration
- Included services

API:
GET /packages

--------------------------------------------------

9. WAITLIST SYSTEM

Screens:
- WaitlistScreen

Features:
- Join waitlist
- Notify user when slot available
- Waitlist status

API:
POST /waitlist

--------------------------------------------------

10. REBOOK FEATURE

Features:
- Book Again button
- Clone previous booking
- Auto-select services and staff

--------------------------------------------------

11. GIFT BOOKING

Screens:
- GiftBookingScreen

Features:
- Book for another person
- Gift message
- Recipient phone number

--------------------------------------------------

12. GROUP BOOKING

Screens:
- GroupBookingScreen

Features:
- Family booking
- Couple booking
- Bridal group booking

--------------------------------------------------
PHASE 4 — COMMUNICATION MODULE
--------------------------------------------------

13. SUPPORT CENTER

Screens:
- SupportCenterScreen
- TicketListScreen
- TicketDetailsScreen
- CreateTicketScreen

Features:
- Raise ticket
- Ticket tracking
- FAQ

API:
GET /support/tickets
POST /support/tickets

--------------------------------------------------

14. LIVE CHAT

Screens:
- ChatScreen

Features:
- Real-time messaging
- Typing indicator
- Read receipts
- Image sharing

Socket.io integration

--------------------------------------------------

15. WHATSAPP INTEGRATION

Features:
- Chat with salon
- Share booking
- Share referral code

--------------------------------------------------
PHASE 5 — PROFILE ENHANCEMENTS
--------------------------------------------------

Create:

Screens:
- PrivacyPolicyScreen
- TermsConditionsScreen
- AboutAppScreen
- DeleteAccountScreen
- LanguageSelectionScreen
- SecurityScreen
- ActiveDevicesScreen

Features:
- Multi-language support
- Logout all devices
- Delete account
- Account privacy

--------------------------------------------------
PHASE 6 — NOTIFICATIONS
--------------------------------------------------

Create:

NotificationPreferenceScreen

Features:
- Booking notifications
- Offer notifications
- Wallet notifications
- Membership notifications
- Push notification settings

--------------------------------------------------
PHASE 7 — WALLET ENHANCEMENTS
--------------------------------------------------

Create:

- GiftCardScreen
- CashbackScreen
- ReferralHistoryScreen
- EarningsScreen

Features:
- Gift cards
- Cashback history
- Referral earnings
- Wallet analytics

--------------------------------------------------
PHASE 8 — ANALYTICS
--------------------------------------------------

Integrate:

- Firebase Analytics
- Crashlytics
- Performance Monitoring

Track:

- App Open
- Search
- Salon View
- Service View
- Booking Started
- Booking Completed
- Payment Success
- Payment Failed
- Review Submitted
- Coupon Applied

Create:
analytics.ts

--------------------------------------------------
PHASE 9 — PRODUCTION HARDENING
--------------------------------------------------

Implement:

1. Error Boundary
2. Global Error Screen
3. Skeleton Loaders
4. Empty State Components
5. No Internet Screen
6. Offline Caching
7. Retry API Strategy
8. Request Queue
9. SSL Pinning Ready Structure
10. Secure Storage
11. Refresh Token Flow
12. Session Management

Create:

components/common/
- EmptyState.tsx
- SkeletonLoader.tsx
- ErrorBoundary.tsx
- OfflineBanner.tsx

screens/common/
- NoInternetScreen.tsx
- GlobalErrorScreen.tsx

--------------------------------------------------
PHASE 10 — PERFORMANCE
--------------------------------------------------

Implement:

- React Query / TanStack Query
- Image optimization
- Pagination
- Infinite scrolling
- Memoization
- Code splitting
- Lazy loading
- API caching

--------------------------------------------------
PHASE 11 — APP STORE READINESS
--------------------------------------------------

Create:

- Privacy Policy Screen
- Terms Screen
- Delete Account Flow
- Permission Handling
- Deep Linking
- Universal Links
- Share Extension Support

--------------------------------------------------
OUTPUT REQUIREMENTS
--------------------------------------------------

For every feature provide:

1. Screen structure
2. Navigation updates
3. Zustand store
4. API contracts
5. TypeScript interfaces
6. Component hierarchy
7. Folder structure
8. UI design guidelines
9. Backend requirements
10. Production considerations

Generate implementation in phases starting from Favorites Module.

--------------------------------------------------
PHASE 12 — FAVORITES MODULE
--------------------------------------------------

Create:

Screens:
- FavoriteSalonsScreen
- FavoriteServicesScreen

Features:
- Add salon to favorites
- Remove salon from favorites
- Save favorite services
- Quick booking from favorites
- Favorite badge on salon cards
- Favorite synchronization

Store:
- favoritesStore.ts

API:
GET /favorites
POST /favorites
DELETE /favorites/:id

--------------------------------------------------
PHASE 13 — STAFF PROFILE MODULE
--------------------------------------------------

Create:

Screens:
- StaffProfileScreen

Features:
- Staff photo gallery
- Experience
- Certifications
- Specializations
- Languages spoken
- Ratings
- Reviews
- Portfolio
- Available slots
- Staff achievements
- Book directly with staff

API:
GET /staff/:id
GET /staff/:id/reviews

--------------------------------------------------
PHASE 14 — SALON GALLERY MODULE
--------------------------------------------------

Create:

Screens:
- SalonGalleryScreen
- GalleryPreviewScreen

Features:
- Full-screen gallery
- Before and after transformations
- Service result photos
- Staff portfolio images
- Zoom support
- Swipe gallery
- Image caching
- Lazy loading

API:
GET /salons/:id/gallery

--------------------------------------------------
PHASE 15 — PACKAGE BOOKING MODULE
--------------------------------------------------

Create:

Screens:
- PackageListingScreen
- PackageDetailsScreen

Features:
- Bridal package
- Groom package
- Hair package
- Skin package
- Festival package
- Package discounts
- Package booking flow

API:
GET /packages
GET /packages/:id

--------------------------------------------------
PHASE 16 — WAITLIST MODULE
--------------------------------------------------

Create:

Screens:
- WaitlistScreen

Features:
- Join waitlist
- Waitlist position
- Slot availability alerts
- Auto-book option
- Push notifications

API:
POST /waitlist
GET /waitlist/status

--------------------------------------------------
PHASE 17 — GIFTING MODULE
--------------------------------------------------

Create:

Screens:
- GiftBookingScreen
- GiftHistoryScreen

Features:
- Gift a service
- Gift package
- Gift card redemption
- Gift message
- Gift scheduling
- Recipient notification

API:
POST /gift-booking
GET /gift-history

--------------------------------------------------
PHASE 18 — REWARDS & LOYALTY SYSTEM
--------------------------------------------------

Create:

Screens:
- RewardsScreen
- LoyaltyPointsScreen
- RewardHistoryScreen

Features:
- Earn points
- Redeem points
- Cashback
- Loyalty tiers
- Reward transactions
- Referral rewards

API:
GET /rewards
POST /rewards/redeem

--------------------------------------------------
PHASE 19 — GIFT CARD SYSTEM
--------------------------------------------------

Create:

Screens:
- GiftCardScreen
- GiftCardPurchaseScreen
- GiftCardHistoryScreen

Features:
- Purchase gift card
- Redeem gift card
- Gift card balance
- Gift card history
- Share gift card

API:
GET /gift-cards
POST /gift-cards/purchase

--------------------------------------------------
PHASE 20 — REFERRAL SYSTEM
--------------------------------------------------

Create:

Screens:
- ReferralHistoryScreen
- ReferralEarningsScreen

Features:
- Invite friends
- Referral earnings
- Referral history
- Referral leaderboard
- Share referral code

API:
GET /referrals
GET /referrals/history

--------------------------------------------------
PHASE 21 — SUPPORT CENTER
--------------------------------------------------

Create:

Screens:
- SupportChatScreen
- TicketListScreen
- TicketDetailsScreen
- CreateTicketScreen

Features:
- Real-time chat
- Raise ticket
- Upload images
- FAQ integration
- Ticket tracking
- Push notifications

API:
GET /support/tickets
POST /support/tickets
GET /support/tickets/:id

--------------------------------------------------
PHASE 22 — SECURITY CENTER
--------------------------------------------------

Create:

Screens:
- SecurityScreen
- ActiveDevicesScreen

Features:
- Device management
- Logout from all devices
- Change phone number
- Biometric authentication
- PIN lock
- Session history
- Login activity
- Security alerts

API:
GET /security/devices
POST /security/logout-all

--------------------------------------------------
PHASE 23 — NOTIFICATION PREFERENCES
--------------------------------------------------

Create:

Screens:
- NotificationPreferenceScreen

Features:
- Booking notifications
- Offer notifications
- Wallet notifications
- Membership notifications
- Push notification controls
- Email notification controls
- WhatsApp notification controls

API:
GET /notification-preferences
PATCH /notification-preferences

--------------------------------------------------
PHASE 24 — LEGAL & COMPLIANCE
--------------------------------------------------

Create:

Screens:
- PrivacyPolicyScreen
- TermsConditionsScreen
- AboutAppScreen

Features:
- Dynamic legal content
- Versioning
- Compliance support
- GDPR-ready structure
- Data transparency

API:
GET /legal/privacy
GET /legal/terms

--------------------------------------------------
PHASE 25 — ACCOUNT MANAGEMENT
--------------------------------------------------

Create:

Screens:
- DeleteAccountScreen

Features:
- Account deletion request
- Deletion confirmation
- Data export request
- Recovery period
- Legal acknowledgement

API:
POST /account/delete
POST /account/export

--------------------------------------------------
PHASE 26 — MULTI-LANGUAGE SUPPORT
--------------------------------------------------

Create:

Screens:
- LanguageScreen

Supported Languages:
- English
- Hindi
- Gujarati

Features:
- Dynamic translations
- Language persistence
- RTL-ready architecture
- Locale formatting

Libraries:
- i18next
- react-i18next

--------------------------------------------------
PHASE 27 — MAPS & LOCATION
--------------------------------------------------

Create:

Screens:
- MapScreen
- SalonDirectionsScreen

Features:
- Nearby salons
- Current location
- Distance calculation
- Open in Google Maps
- Route navigation
- Salon clustering
- Location permissions

API:
GET /salons/nearby