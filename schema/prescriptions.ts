import { prescription } from "@prisma/client";
import { z } from "zod";


export const PrescriptionSchema = z.object({
  id: z.string(),
  convertedText: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().cuid(),
  barangayId: z.string(),
}) satisfies z.ZodType<prescription>;

export type TPrescriptionSchema = z.infer<typeof PrescriptionSchema>
export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const CreatePrescriptionSchema = PrescriptionSchema.pick({
    userId:true
})
.extend({
  image: z.any()
  .refine((val) => val?.length > 0, "File is required")
  // .refine(
  //   (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
  //   "Only .jpg, .jpeg, .png and .webp formats are supported."
  // )
  // .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`),
})
export const UpdatePrescriptionSchema = PrescriptionSchema.pick({
  convertedText:true
})

export type TCreatePrescriptionSchema = z.infer<typeof CreatePrescriptionSchema>
export type TUpdatePrescriptionSchema = z.infer<typeof UpdatePrescriptionSchema>

export const PrescriptionQuerySchema = PrescriptionSchema.pick({
  userId:true,
})
.partial({
  userId:true,
})

