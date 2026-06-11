import { z } from 'zod';

const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');

export const loginSchema = z.object({
  phone: phoneSchema,
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters'),
  phone: phoneSchema,
  terms: z.literal(true, { message: 'You must accept the terms' }),
});

export const otpSchema = z.object({
  otp: z.string().length(4, 'Enter the 4-digit code'),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
export type OTPForm = z.infer<typeof otpSchema>;
