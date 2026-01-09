import { z } from "zod";

export const vendorOnboardingSchema = z.object({
  // Store Information
  business_name: z
    .string()
    .min(3, "Store name must be at least 3 characters long")
    .max(100, "Store name is too long"),

  description: z
    .string()
    .min(10, "Please describe your store in at least 10 characters")
    .max(500, "Description too long"),

  // Location
  address: z.string().min(3, "Address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State/Region is required"),

  // Coordinates (Added to fix Errors 1-4)
  // We allow string or number because inputs return strings but your hook returns numbers
  latitude: z.union([z.string(), z.number()]).optional(),
  longitude: z.union([z.string(), z.number()]).optional(),

  // Business Details (Optional)
  cac_registration_number: z.string().optional(),
  business_id: z.string().optional(),
  wallet_address: z.string().optional(),

  // Financials
  // Changed to string to preserve leading zeros (e.g., "0123456789")
  account_number: z
    .string()
    .regex(/^\d+$/, "Account number must contain only digits")
    .optional()
    .or(z.literal("")),
    
  bank_name: z.string().optional(),

  website: z
    .string()
    .url("Enter a valid website URL")
    .optional()
    .or(z.literal("")),

  // Branding (Changed to string to expect URLs as per your input placeholders)
  logo: z.any().optional(),
  banner: z.any().optional(),
});

export type VendorOnboardingData = z.infer<typeof vendorOnboardingSchema>;