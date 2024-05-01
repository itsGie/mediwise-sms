import { BrgyItem } from "@prisma/client";
import { z } from "zod";

export type TItemBrgy = z.infer<typeof ItemBrgySchema>;
export type TItemBrgyGetQuery = z.infer<typeof ItemBrgyGetQuerySchema>;
export type TCreateBrgyItem = z.infer<typeof CreateBrgyItemSchema>;
export type TUpdateBrgyItem = z.infer<typeof UpdateBrgyItemSchema>;

export const ItemBrgySchema = z.object({
  id: z.string(),
  description: z.string().nullable(),
  name: z.string().nullable(),
  stock: z.number().nullable(),
  unit: z.string().nullable(),
  createdAt: z.date(),
  dosage: z.string().nullable(),
  category_id: z.string().nullable(),
  updatedAt: z.date(),
  barangayId: z.string().nullable(),
  requestId: z.string().nullable(),
  isArchive: z.boolean(),
}) satisfies z.ZodType<BrgyItem>;

export const ItemBrgyGetQuerySchema = z.object({
  name: z.string().optional(),
  barangayId: z.string().cuid().optional()
});

export const CreateBrgyItemSchema = ItemBrgySchema.pick({
  // brgyId: true,
  name: true,
  description: true,
  unit: true,
  category_id:true,
  // stock: true,
  dosage:true
}).extend({
  brgyId: z.string().cuid(),
  name: z.string().min(1,"Required").max(255),
  description: z.string().min(1,"Required").max(255),
  category_id: z.string().min(1, "Required"),
  unit: z.string().min(1,"Required").max(255).optional(),
  dosage: z.string().min(1,"Required").max(255),
  // stock: z.string().min(1,"Required").max(255),
});

export const UpdateBrgyItemSchema = ItemBrgySchema.pick({
  name: true,
  description: true,
  unit: true,
  // stock: true,
  dosage:true,
}).extend({
  name: z.string().min(1,"Required").max(255).optional(),
  description: z.string().min(1,"Required").max(255).optional(),
  unit: z.string().min(1,"Required").max(255).optional(),
  dosage: z.string().min(1,"Required").max(255).optional(),
  category_id: z.string().min(1, "Required"),
  // stock: z.coerce.number().min(1,"Required").max(255).optional(),
});


