import getCurrentUserPages from "@/actions/getCurrentUser-Page";
import prisma from "@/lib/prisma";
import sendMail from "@/lib/smtp";
import { getTime } from "@/lib/utils";
import { RescheduleAppointmentSchema, UpdateAppointmentSchema } from "@/schema/appointment";
import { getAppointmentById, updateAppointmentById } from "@/service/appointment";
import { NextApiResponseServerIo } from "@/types/types";
import { NextApiRequest } from "next";
import nodeSchedule from "node-schedule"
import handlebars from 'handlebars'
import fs from 'fs'
import moment from "moment-timezone";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const { appointmentId } = req.query;
  // // always use this in /pages/api it needs req, res arguments
  const currentUser = await getCurrentUserPages(req, res);

  if (!currentUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId as string,
    },
    include: {
      workSchedule: {
        include: {
          appointments: {
            where: {
              status: {
                in: ['ACCEPTED', 'COMPLETED']
              }
            }
          }
        }
      }
    }
  })

  if (!appointmentId || !appointment) {
    return res
      .status(404)
      .json({ message: "appointment ID/Appointment not found" });
  }

  if (req.method === "PATCH") {
    const body = await UpdateAppointmentSchema.safeParseAsync(req.body);

    if (!body.success) {
      return res.status(404).json({
        errors: body.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      });
    }

    const { title, doctorId, patientId, date, status, image_path } =
        body.data;

      const appointmentUpdated = await prisma.appointment.update({
        where: {
          id: appointmentId as string,
        },
        data: {
          title,
          doctorId,
          patientId,
          date,
          status,
          image_path,
          queue_number: (appointment.workSchedule.appointments.length + 1) + '',
        },
        include: {
          workSchedule:true,
          doctor: {
            include: {
              profile:true
            }
          },
          patient: {
            include: {
              profile:true
            }
          }
        }
      })  

     const notification = await prisma.notification.create({
        data: {
          content: `Your appointment has been ${appointmentUpdated.status.toLocaleLowerCase()}`,
          appointmentId: appointmentUpdated.id,
          userId: appointmentUpdated.patientId,
        }
      })

      


// Combine the date parts
      const formattedDate = `${appointmentUpdated.date?.getFullYear()}-${(appointmentUpdated.date?.getMonth() + 1)}-${appointmentUpdated.date?.getDate()}`;
      const timeStart = moment.utc(appointmentUpdated.workSchedule.start).toDate()
      const timeEnd = moment.utc(appointmentUpdated.workSchedule.end).toDate()
      const start = getTime(timeStart!)
      const end = getTime(timeEnd!)
      const source = fs.readFileSync(`${__dirname}/../../../../../../public/template/appointment-confirmation.html`, 'utf-8').toString()
      const template = handlebars.compile(source)
      const replacement = {
        date: formattedDate,
        concern: appointmentUpdated.title,
        timeStart:start,
        timeEnd:end,
        queue: appointmentUpdated.queue_number,
        doctor:  `${appointmentUpdated.doctor.profile?.firstname} ${appointmentUpdated.doctor.profile?.lastname}`,
        specialist:  `${appointmentUpdated.doctor.profile?.specialist}`
      }
      const content = template(replacement);
      
    //   const content = `
    // <div> 
    //   <h3> Hello ${appointmentUpdated.patient.profile?.firstname} ${appointmentUpdated.patient.profile?.lastname} </h3>
    //   <p> Your appointment has been ${appointmentUpdated.status.toLocaleLowerCase()}</p>
    //   ${appointmentUpdated?.status === 'ACCEPTED' && `<p>Date: ${formattedDate} </p>`}
    //   ${appointmentUpdated?.status === 'ACCEPTED' && `<p>Time: ${timeStart} - ${timeEnd}</p>`}
    //   ${appointmentUpdated?.status === 'ACCEPTED' && `<p> Queue number: ${appointmentUpdated.queue_number} </p>`}
    //   <small> - SMS ADMIN </small>
    // </div>
    // `;

    if(appointmentUpdated.status === 'ACCEPTED') {
      sendMail({ content, subject: "Appointment", emailTo: appointmentUpdated.patient.email as string });
      const reminderTime = new Date(appointmentUpdated.workSchedule?.start! || appointmentUpdated.date);
      reminderTime.setHours(reminderTime.getHours() - 1);
      nodeSchedule.scheduleJob(appointmentUpdated.id, reminderTime, () => {

        const source = fs.readFileSync(`${__dirname}/../../../../../../public/template/appointment-reminder.html`, 'utf-8').toString()
        const template = handlebars.compile(source)
        const replacement = {
          date: formattedDate,
          concern: appointmentUpdated.title,
          timeStart:start,
          queue: appointmentUpdated.queue_number,
          doctor:  `${appointmentUpdated.doctor.profile?.firstname} ${appointmentUpdated.doctor.profile?.lastname}`,
          specialist:  `${appointmentUpdated.doctor.profile?.specialist}`
        }
        const reminderContent = template(replacement);
        sendMail({ content:reminderContent, subject: "Appointment Reminder", emailTo: appointmentUpdated.patient.email as string });
      })
    }

    if(appointmentUpdated.status === 'CANCELLED') {
      nodeSchedule.cancelJob(appointmentUpdated.id)
    }


      const Key = `notification:${notification.userId}:create`;
            console.log("new notification socket:", Key);
            res.socket?.server?.io.emit(Key, notification);
      return res.status(200).json(appointmentUpdated);

  } 
  if (req.method === "PUT") {
    const body = await RescheduleAppointmentSchema.safeParseAsync(req.body);

    if (!body.success) {
      return res.status(404).json({
        errors: body.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      });
    }

    const { date } =
        body.data;

      const appointmentUpdated = await prisma.appointment.update({
        where: {
          id: appointmentId as string,
        },
        data: {
          date: new Date(date)
        },
        include: {
          workSchedule:true,
          doctor: {
            include: {
              profile:true
            }
          },
          patient: {
            include: {
              profile:true
            }
          }
        }
      })  

      nodeSchedule.cancelJob(appointmentUpdated.id)
      const timeStart = getTime(appointmentUpdated.workSchedule.start!)
      const timeEnd = getTime(appointmentUpdated.workSchedule.end!)
      const reminderTime = new Date(appointmentUpdated.workSchedule?.start! || appointmentUpdated.date);
      reminderTime.setHours(reminderTime.getHours() - 1);
      
      nodeSchedule.scheduleJob(appointmentUpdated.id, reminderTime, () => {
        const reminderContent = `
        <div> 
          <h3> Hello ${appointmentUpdated.patient.profile?.firstname} ${appointmentUpdated.patient.profile?.lastname} </h3>
          <p> Reminder that you have an appointment today at ${timeStart} </p>
          <p> Queue number: ${appointmentUpdated.queue_number} </p>
          <small> - SMS ADMIN </small>
        </div>
        `;
        sendMail({ content:reminderContent, subject: "Appointment Reminder", emailTo: appointmentUpdated.patient.email as string });
      })

     const notification = await prisma.notification.findFirst({
      where: {
        appointmentId: appointmentId as string
      }
      })

      const updatedNotification = await prisma.notification.update({
        where: {
          id: notification?.id as string
        },
          data: {
            content: `Your appointment has been rescheduled`,
            appointmentId: appointmentUpdated.id,
            userId: appointmentUpdated.patientId,
            isRead:false,
            createdAt: new Date()
          }
        })

      const content = `
    <div> 
      <h3> Hello ${appointmentUpdated.patient.profile?.firstname} ${appointmentUpdated.patient.profile?.lastname} </h3>
      <p> Your appointment has been rescheduled </p>

      <p> Queue number: ${appointmentUpdated.queue_number} </p>
      <small> - SMS ADMIN </small>
    </div>
    `;

    sendMail({ content, subject: "Appointment Reschedule", emailTo: appointmentUpdated.patient.email as string });
      const Key = `notification:${updatedNotification.userId}:create`;
      res.socket?.server?.io.emit(Key, notification);
      return res.status(200).json(appointmentUpdated);
  } 
  
  else if (req.method === "DELETE") {
    const cancelAppointment = await prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        status: 'CANCELLED',
      }
    })

    const notification = await prisma.notification.create({
      data: {
        content: `Your appointment has been cancelled`,
        appointmentId: cancelAppointment.id,
        userId: cancelAppointment.patientId,
      }
    })

    nodeSchedule.cancelJob(cancelAppointment.id)

    const Key = `notification:${notification.userId}:create`;
            console.log("new notification socket:", Key);
            res.socket?.server?.io.emit(Key, notification);
      return res.status(200).json(cancelAppointment);

  }
  
  else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
