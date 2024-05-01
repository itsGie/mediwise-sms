import { AppoinmentStatus, Appointment, appointment_item } from "@prisma/client";
import { z } from "zod";

export const AppointmentItemSchema = z.object({
    id: z.string().cuid(),
    brgyItemId:   z.string().cuid(),
    appointmentId: z.string().cuid(),
    quantity: z.number().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
  }) satisfies z.ZodType<appointment_item>;

  export const CreateAppointmentItemSchema = AppointmentItemSchema
  .pick({quantity:true,})
  .extend({
    itemId: z.string().cuid(),
    unit: z.string(),
    name: z.string(),
    stock: z.number().min(1),
  })

  export type TCreateAppointmentItemSchema = z.infer<typeof CreateAppointmentItemSchema>