import { Barangay } from "@prisma/client";
import { z } from "zod";

export type TBarangay = z.infer<typeof BarangaySchema>;
export type TBarangayGetQuery = z.infer<typeof BarangayGetQuerySchema>;
export type TCreateBarangay = z.infer<typeof CreateBarangaySchema>;
export type TUpdateBarangay = z.infer<typeof UpdateBarangaySchema>;

export const BarangaySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  zip: z.string().nullable(),
  district: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Barangay>;

export const BarangayGetQuerySchema = z.object({
  name: z.string().optional(),
});

export const CreateBarangaySchema = BarangaySchema.pick({
  name: true,
  zip: true,
  district: true,
}).extend({
  name: z.string().min(3).max(255),
  district: z.string().min(1).max(255),
  zip: z.coerce.number(),
});

export const UpdateBarangaySchema = BarangaySchema.pick({
  name: true,
  district:true
}).extend({
  name: z.string().min(3).max(255),
  district: z.string().min(1).max(255),
  zip: z.coerce.number(),
});
