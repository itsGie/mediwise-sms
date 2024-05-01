import { Item } from "@prisma/client";
import { z } from "zod";

export const ItemSchema = z.object({
    id: z.string(),
    product_number: z.string(),
    expiration_date: z.date(),
    brgyItemId: z.string(),
    onhandItemId: z.string(),
    smsItemId: z.string(),
    updatedAt: z.date(),
    createdAt: z.date(),
  }) satisfies z.ZodType<Item>;
  
  export const CreateItemSchema = ItemSchema.pick({
    product_number: true,
    expiration_date: true,
    brgyItemId:true,
    smsItemId:true,
  })
  .partial({
    brgyItemId:true,
    smsItemId:true,
  })
  .extend({
    expiration_date:z.string(),
    product_number:z.string().min(1, "Required")
  })
  
  export type TItemSchema = z.infer<typeof ItemSchema>
  export type TCreateItemSchema = z.infer<typeof CreateItemSchema>