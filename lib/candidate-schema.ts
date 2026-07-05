import { z } from "zod";

export const candidateCoreSchema = z.object({
  name: z.string().min(1, "Name is required"),
  barangay: z.string().min(1, "Barangay is required"),
  bio: z.string().min(1, "Bio is required"),
  sashNumber: z.coerce.number().int().positive("Sash number must be a positive integer"),
});

export const socialLinksSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
});

export const candidateSeedEntrySchema = candidateCoreSchema.extend({
  photoFile: z.string().min(1, "photoFile is required"),
  socialLinks: socialLinksSchema.optional(),
});

export type CandidateSeedEntry = z.infer<typeof candidateSeedEntrySchema>;
