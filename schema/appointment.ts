import { AppoinmentStatus, Appointment, DispensingStatus } from "@prisma/client";
import { z } from "zod";

export type TAppointment = z.infer<typeof AppointmentSchema>;
export type TCreateAppointment = z.infer<typeof CreateAppointmentSchema>;
export type TUpdateAppointment = z.infer<typeof UpdateAppointmentSchema>;
export type TAppointmentGetQuery = z.infer<typeof AppointmentGetQuerySchema>;

export const AppointmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  doctorId: z.string(),
  patientId: z.string(),
  illness: z.string().nullable(),
  isDeleted:z.boolean(),
  date: z.date(),
  status: z.nativeEnum(AppoinmentStatus),
  image_path: z.string().nullable(),
  queue_number: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  barangayId: z.string(),
  workScheduleId: z.string(),
  dispensing_status:z.nativeEnum(DispensingStatus)
}) satisfies z.ZodType<Appointment>;

export const AppointmentGetQuerySchema = AppointmentSchema.pick({
  status: true,
  date: true,
  barangayId: true,
  doctorId:true,
  patientId:true,
  workScheduleId:true,
})
.extend({
  date: z.coerce.date(),
})
.partial({
  status: true,
  date: true,
  barangayId:true,
  doctorId:true,
  patientId:true,
  workScheduleId:true,
})

export const CreateAppointmentSchema = AppointmentSchema.pick({
  title: true,
  doctorId: true,
  patientId: true,
  date: true,
  status: true,
  image_path: true,
  barangayId: true,
  illness:true
}).extend({
  title: z.string().min(3).max(255),
  illness:z.string().optional(),
  doctorId: z.string().cuid(),
  patientId: z.string().cuid(),
  date: z.coerce.date(),
  status: z.nativeEnum(AppoinmentStatus),
  image_path: z.string().min(3).max(255).optional(),
});

export const UpdateAppointmentSchema = AppointmentSchema.pick({
  title: true,
  doctorId: true,
  patientId: true,
  date: true,
  status: true,
  image_path: true,
})
  .extend({
    title: z.string().min(3).max(255),
    doctorId: z.string().cuid(),
    patientId: z.string().cuid(),
    date: z.coerce.date(),
    status: z.nativeEnum(AppoinmentStatus),
    image_path: z.string().min(3).max(255),
  })
  .partial();


  export const CreateAppointmentPrescriptionSchema = AppointmentSchema.pick({})
.extend({
  image: z.any().refine((val) => val?.length > 0, "File is required"),
})

export type TCreateAppointmentPrescriptionSchema = z.infer<typeof CreateAppointmentPrescriptionSchema>

export const RescheduleAppointmentSchema = AppointmentSchema.pick({
  date: true,
})
  .extend({
    date: z.string().min(1, "Required")
  })
  
export type TRescheduleAppointmentSchema = z.infer<typeof RescheduleAppointmentSchema>
