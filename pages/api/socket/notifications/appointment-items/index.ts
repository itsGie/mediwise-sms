import getCurrentUserPages from "@/actions/getCurrentUser-Page";
import prisma from "@/lib/prisma";
import sendMail from "@/lib/smtp";
import { RescheduleAppointmentSchema, UpdateAppointmentSchema } from "@/schema/appointment";
import { getAppointmentById, updateAppointmentById } from "@/service/appointment";
import { NextApiResponseServerIo } from "@/types/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  const {appointmentId, userId} = req.body
  // // always use this in /pages/api it needs req, res arguments
  // const currentUser = await getCurrentUserPages(req, res);

  // if (!currentUser) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId as string,
    }
  })

  if (!appointmentId || !appointment) {
    return res
      .status(404)
      .json({ message: "appointment ID/Appointment not found" });
  }

  if(req.method === "POST") {
    const notification = await prisma.notification.create({
      data: { 
        appointmentId,
        content: "Medicines has been dispatched",
        userId: userId
      }
    })
    const Key = `notification:${notification.userId}:create`;
    console.log("new notification socket:", Key);
    res.socket?.server?.io.emit(Key, notification);

  return res.status(200).json(notification);
  }
  else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
