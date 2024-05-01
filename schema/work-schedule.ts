import { WorkSchedule } from "@prisma/client";
import { z } from "zod";

// export type TAppointment = z.infer<typeof AppointmentSchema>;
// export type TCreateAppointment = z.infer<typeof CreateAppointmentSchema>;
// export type TUpdateAppointment = z.infer<typeof UpdateAppointmentSchema>;


export const WorkScheduleSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    isArchived: z.boolean(),
    start: z.date(),
    end: z.date(),
    allDay: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    doctorId: z.string().cuid(),
    barangayId: z.string().cuid()
  }) satisfies z.ZodType<WorkSchedule>;

  export const CreateWorkScheduleSchema = WorkScheduleSchema.pick({
    id: true,
    title: true,
    allDay: true,
    start: true,
    end: true,
    barangayId: true,
    doctorId:true
  })
  .extend({
    start: z.string(),
    end: z.string(),
  })
  .partial({
    doctorId:true
  })


  export type CreateWorkScheduleSchemaType = z.infer<typeof CreateWorkScheduleSchema>;

  export const UpdateWorkScheduleSchema = WorkScheduleSchema.pick({
    title: true,
    allDay: true,
    start: true,
    end: true,
  }).partial()
  .extend({
    start: z.coerce.date(),
    end: z.coerce.date()
  })

  export type UpdateWorkScheduleSchemaType = z.infer<typeof UpdateWorkScheduleSchema>;

  export const DeleteWorkScheduleSchema = WorkScheduleSchema.pick({
    id:true
  })

  export type DeleteWorkScheduleSchemaType = z.infer<typeof DeleteWorkScheduleSchema>;
