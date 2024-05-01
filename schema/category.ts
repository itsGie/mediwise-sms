import { Category } from "@prisma/client";
import { z } from "zod";

export type TCategorySchema = z.infer<typeof CategorySchema>;

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Required"),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Category>;

export type TCreateCategorySchema = z.infer<typeof CreateCategorySchema>;

export const CreateCategorySchema = CategorySchema.pick({
    name: true,
})

export type TUpdateCategorySchema = z.infer<typeof UpdateCategorySchema>;

export const UpdateCategorySchema = CategorySchema.pick({
    id:true,
    name:true,
})