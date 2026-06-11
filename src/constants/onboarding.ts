export const ONBOARDING_COLORS = {
  primaryTeal: '#FF5C8A',
  accentGold: '#F59E0B',
  background: '#0F172A',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  indicatorInactive: '#CBD5E1',
} as const;

// Alias used by HighlightHeading and Onboarding1-4
export const OB = {
  primaryTeal: '#FF5C8A',
  teal: '#FF5C8A',
  gold: '#F59E0B',
  bg: '#0F172A',
  background: '#0F172A',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
} as const;

export const ONBOARDING_TYPOGRAPHY = {
  heading: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '700' as const,
  },
  description: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
} as const;
