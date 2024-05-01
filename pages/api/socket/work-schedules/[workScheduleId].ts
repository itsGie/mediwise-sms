import getCurrentUserPages from "@/actions/getCurrentUser-Page";
import prisma from "@/lib/prisma";
import sendMail from "@/lib/smtp";
import { RescheduleAppointmentSchema, UpdateAppointmentSchema } from "@/schema/appointment";
import { TUser } from "@/schema/user";
import { UpdateWorkScheduleSchema } from "@/schema/work-schedule";
import { getAppointmentById, updateAppointmentById } from "@/service/appointment";
import { NextApiResponseServerIo } from "@/types/types";
import { Appointment, Profile, User } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const { workScheduleId } = req.query;
  // // always use this in /pages/api it needs req, res arguments
  const currentUser = await getCurrentUserPages(req, res);

  if (!currentUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const workSchedule = await prisma.workSchedule.findUnique({
    where: {
      id: workScheduleId as string,
    }
  })

  if (!workScheduleId || !workSchedule) {
    return res
      .status(404)
      .json({ message: "Work Schedule ID/Work Schedule not found" });
  }

  if (req.method === "PATCH") {
    try {
      const body = await UpdateWorkScheduleSchema.safeParseAsync(
        req.body
      );
      
    if (!body.success) {
      return res.status(404).json({
        errors: body.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      });
    }

    const { title, start, end, allDay } = body.data;

    // Create a new Date object with the modified start time
    const modifiedStart = new Date(start);
    modifiedStart.setUTCHours(0, 0, 0, 0);
    
    const updatedWorkSchedule = await prisma.workSchedule.update({
        where: {
            id: workScheduleId as string,
        },
        data: {
            title,
            start: start, // Use the modified start time
            end,
            allDay,
            appointments: {
                updateMany: {
                    where: {
                        status: {
                            in: ['ACCEPTED', "PENDING"]
                        }
                    },
                    data: {
                        date: modifiedStart.toISOString() // Use modified start time here as well
                    }
                }
            }
        },
        include: {
            appointments:{
                include: {
                    patient:{
                        include: {
                            profile:true
                        }
                    }
                }
            }   
        }
    });

      const createNotification = async (appointment: Appointment) => {
        const notification = await prisma.notification.create({
          data: {
            userId: appointment.patientId,
            appointmentId: appointment.id,
            content: `Your appointment has been moved.`
          }
        })

        const Key = `notification:${notification.userId}:create`;
        res.socket?.server?.io.emit(Key, notification);
        
        if(!notification) {
          throw new Error('Notification did not create')
        }
        
        return notification
      }

      const students = await Promise.all(
        updatedWorkSchedule.appointments.map((appointment) => createNotification(appointment))
      );

    //   const content = `
    // <div> 
    //   <h3> hello ${appointmentUpdated.patient.profile?.firstname} ${appointmentUpdated.patient.profile?.lastname} </h3>
    //   <p> ${appointmentUpdated.doctor.profile?.firstname} ${appointmentUpdated.doctor.profile?.lastname} ${appointmentUpdated.status.toLocaleLowerCase()} your appointment </p>
    //   <small> - SMS ADMIN </small>
    // </div>
    // `;

    // sendMail({ content, subject: "Email verification", emailTo: appointmentUpdated.patient.email as string });

    //   const Key = `notification:${notification.userId}:create`;
    //         console.log("new notification socket:", Key);
    //         res.socket?.server?.io.emit(Key, notification);

      return res.status(200).json(updatedWorkSchedule);

    } catch (error) {
      console.error(error)
    }
  } 
  
  else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
