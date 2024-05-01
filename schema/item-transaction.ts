import {
  ItemTransactionStatus,
  ItemTransaction,
  RequestedItem,
} from "@prisma/client";
import { z } from "zod";

// type
export type TRequestedItem = z.infer<typeof RequestedItemSchema>;
export type TItemTransaction = z.infer<typeof ItemTransactionSchema>;

export type TItemTransactionGetQuery = z.infer<
  typeof ItemTransactionGetQuerySchema
>;
export type TCreateItemTransaction = z.infer<
  typeof CreateItemTransactionSchema
>;
export type TUpdateItemTransaction = z.infer<
  typeof UpdateItemTransactionSchema
>;

// requested item schema
export const RequestedItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  itemId: z.string().nullable(),
  itemTransactionId: z.string().nullable(),
}) satisfies z.ZodType<RequestedItem>;

// item transaction base schema
export const ItemTransactionSchema = z.object({
  id: z.string(),
  description: z.string().nullable(),
  status: z.nativeEnum(ItemTransactionStatus),
  barangayId: z.string().nullable(),
  reference: z.string().nullable(),
  fileReport: z.string().nullable(),
  barangayUserId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isArchive: z.boolean(),
  requested_items: z.array(RequestedItemSchema).optional(),
}) satisfies z.ZodType<ItemTransaction>;

// get query params schema
export const ItemTransactionGetQuerySchema = z.object({
  barangayId: z.string().optional(),
  status: z.nativeEnum(ItemTransactionStatus).optional(),
});

// create item transaction schema
export const CreateItemTransactionSchema = ItemTransactionSchema.pick({
  description: true,
  fileReport:true,
  status: true,
  barangayId: true,
  barangayUserId: true,
}).extend({
  description: z.string().min(1).max(255).optional(),
  status: z.nativeEnum(ItemTransactionStatus).optional(), // by default in prisma ItemTransactionStatus is PENDING
  barangayId: z.string().min(1).max(255),
  barangayUserId: z.string().min(1).max(255),
  fileReport: z.any().refine((val) => !!val , "File is required")
});

// update item transaction schema
export const UpdateItemTransactionSchema = ItemTransactionSchema.pick({
  status: true,
}).extend({
  status: z.nativeEnum(ItemTransactionStatus),
});


export const UpdateItemTransactionSchemaStatus = ItemTransactionSchema.pick({
  status: true,
  id: true,
}).extend({
  status: z.nativeEnum(ItemTransactionStatus),
});


export const CancelItemTransactionSchemaStatus = ItemTransactionSchema.pick({
  id: true,
}).extend({
});


export type TUpdateItemTransactionSchemaStatus = z.infer<typeof UpdateItemTransactionSchemaStatus>