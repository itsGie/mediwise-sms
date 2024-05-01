import { SmsItem } from "@prisma/client";
import { z } from "zod";

export type TItemSms = z.infer<typeof ItemSmsSchema>;
export type TItemSmsGetQuery = z.infer<typeof ItemSmsGetQuerySchema>;
export type TCreateSmsItem = z.infer<typeof CreateSmsItemSchema>;
export type TUpdateSmsItem = z.infer<typeof UpdateSmsItemSchema>;

export const ItemSmsSchema = z.object({
  id: z.string(),
  description: z.string().nullable(),
  name: z.string().nullable(),
  stock: z.number().nullable(),
  unit: z.string().nullable(),
  createdAt: z.date(),
  dosage: z.string().nullable(),
  category_id: z.string().nullable(),
  updatedAt: z.date(),
  supplierId: z.string().cuid().nullable(),
  isArchive: z.boolean(),
}) satisfies z.ZodType<SmsItem>;

export const ItemSmsGetQuerySchema = z.object({
  name: z.string().optional(),
  supplierId: z.string().cuid().optional(),
}).extend({
  barangayId: z.string().optional()
})

export const CreateSmsItemSchema = ItemSmsSchema.pick({
  name: true,
  description: true,
  unit: true,
  // stock: true,
  category_id:true,
  supplierId: true,
  dosage:true
}).extend({
  name: z.string().min(1, "Required").max(255),
  description: z.string().min(1, "Required").max(255),
  unit: z.string().min(1, "Required").max(255),
  dosage: z.string().min(1, "Required").max(255),
  category_id: z.string().min(1, "Required"),
  // stock: z.coerce.number().min(1, "Required").max(255),
  supplierId: z.string().cuid().min(1, "Required"),
});

export const UpdateSmsItemSchema = ItemSmsSchema.pick({
  name: true,
  description: true,
  unit: true,
  // stock: true,
  dosage:true,
}).extend({
  name: z.string().min(1, "Required").max(255).optional(),
  description: z.string().min(1, "Required").max(255).optional(),
  unit: z.string().min(1, "Required").max(255).optional(),
  dosage: z.string().min(1, "Required").max(255).optional(),
  category_id:z.string().min(1, "Required").max(255)
  // stock: z.coerce.number().min(1, "Required").max(255).optional(),
});
