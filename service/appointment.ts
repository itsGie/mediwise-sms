import "server-only";

import prisma from "@/lib/prisma";
import { AppoinmentStatus } from "@prisma/client";
import moment from "moment-timezone";
import shortUniqueId from "short-unique-id"

// get all appointments by role
export const getAppointments = async ({
  status,
  date,
  barangayId,
  doctorId,
  patientId,
  workScheduleId
}: {
  status: AppoinmentStatus | undefined;
  date: Date | string | undefined;
  barangayId: string | undefined;
  doctorId: string | undefined;
  patientId: string | undefined;
  workScheduleId: string | undefined;
}) => {
  const d = new Date(date || new Date())
  // d.setDate(d.getDate() - 1);
  console.log(moment(d).toDate())
  return await prisma.appointment.findMany({
    where: {
          isDeleted: false,
          status: status ?? undefined,
          doctorId: doctorId ?? undefined,
          barangayId: barangayId?? undefined,
          patientId: patientId?? undefined,
          workScheduleId: workScheduleId?? undefined,
          date: {
            equals: date ? moment(d).toDate() : undefined,
          },
    },
    orderBy: {
      date: "desc",
    },
    include: {
      doctor: {
        include: {
          profile: true,
        },
      },
      patient: {
        include: {
          profile: true,
        },
      },
    },
  });
};

// get appointment by id
export const getAppointmentById = async ({ id }: { id: string }) => {
  return await prisma.appointment.findUnique({
    where: {
      id,
      isDeleted:false
    },
    include: {
      barangay:true,
      doctor:{
        include:{
          profile:true
        }
      },
      patient:{
        include:{
          profile:true
        }
      },
      appointment_item:{
        include: {
          brgyItem:{
            include: {
              items:true
            }
          },
        }
      }
    }
  });
};

// create appointment
export const createAppointment = async ({
  title,
  doctorId,
  patientId,
  date,
  status,
  image_path,
  barangayId,
  workScheduleId,
  illness
}: {
  title: string;
  doctorId: string;
  patientId: string;
  date: Date;
  barangayId: string;
  workScheduleId: string;
  status: AppoinmentStatus;
  image_path?: string;
  illness:string;
}) => {
  const {randomUUID} = new shortUniqueId({length:5, dictionary: 'number'})
  console.log('iiidd', randomUUID())
  return await prisma.appointment.create({
    data: {
      title,
      doctorId,
      patientId,
      illness,
      queue_number:randomUUID(),
      date,
      status,
      image_path,
      barangayId,
      workScheduleId,
    },
  });
};

// update appointment
export const updateAppointmentById = async ({
  id,
  title,
  doctorId,
  patientId,
  date,
  status,
  image_path,
}: {
  id: string;
  title?: string;
  doctorId?: string;
  patientId?: string;
  date?: Date;
  status?: AppoinmentStatus;
  image_path?: string;
}) => {
  return await prisma.appointment.update({
    where: {
      id,
    },
    data: {
      title,
      doctorId,
      patientId,
      date,
      status,
      image_path,
    },
  });
};

// delete appointment by id
export const deleteAppointmentById = async ({ id }: { id: string }) => {
  return await prisma.appointment.delete({
    where: {
      id,
    },
  });
};
