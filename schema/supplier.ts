import { Supplier, SupplierStatus } from "@prisma/client";
import { z } from "zod";

export const SupplierSchema = z.object({
    id: z.string().min(1, "required"),
    name: z.string().min(1, "required"),
    contactPerson: z.string().min(1, "required"),
    address: z.string().min(1, "required"),
    contactNo: z.string().min(1, "required"),
    status: z.nativeEnum(SupplierStatus),
    createdAt: z.date(),
    updatedAt: z.date(),
}) satisfies z.ZodType<Supplier>;

export type TSupplierSchema = z.infer<typeof SupplierSchema>


export const CreateSupplierSchema = SupplierSchema.pick({
    name:true,
    contactNo:true,
    contactPerson:true,
    address:true,
})

export type TCreateSupplierSchema = z.infer<typeof CreateSupplierSchema>