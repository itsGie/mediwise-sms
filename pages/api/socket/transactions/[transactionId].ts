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
  const {transactionId, status} = req.body
  // // always use this in /pages/api it needs req, res arguments
  // const currentUser = await getCurrentUserPages(req, res);

  // if (!currentUser) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  const transaction = await prisma.itemTransaction.findUnique({
    where: {
      id: transactionId as string,
    },
    include: {
        barangayUser:true,
        barangay:true,
    }
  })

  if (!transaction) {
    return res
      .status(404)
      .json({ message: "appointment ID/Appointment not found" });
  }

  if(req.method === "POST") {
    console.log('notify user')

      const stockManager = await prisma.user.findMany({
        where: {
            role: 'STOCK_MANAGER'
        }
      })

      Promise.all(stockManager.map(async(stockManager) => {
        const notification = await prisma.notification.create({
            data: {
              transactionId,
              content: `${transaction.barangay?.name} has filed a request`,
              userId: stockManager.id as string
            }
          })

          const Key = `notification:${notification.userId}:create`;
          console.log("new notification socket:", Key);
          res.socket?.server?.io.emit(Key, notification);
      }))

      return res.status(200).json({result: 'Ok'});
  }

  if(req.method === "PUT") {
    console.log('notify user')

      const administrators = await prisma.user.findMany({
        where: {
            role: 'ADMIN',
            barangayId: transaction.barangayId
        }
      })

      Promise.all(administrators.map(async(admin) => {
        const notification = await prisma.notification.create({
            data: {
              transactionId,
              content: `The transaction has been updated`,
              userId: admin.id as string
            }
          })

          const Key = `notification:${notification.userId}:create`;
          console.log("new notification socket:", Key);
          res.socket?.server?.io.emit(Key, notification);
      }))
      return res.status(200).json({result: 'Ok'});
  }

  if(req.method === "PATCH") {
    console.log('notify user')

      const administrators = await prisma.user.findMany({
        where: {
            role: 'ADMIN',
            barangayId: transaction.barangayId
        }
      })

      Promise.all(administrators.map(async(admin) => {
        const notification = await prisma.notification.create({
            data: {
              transactionId,
              content: `The transaction has been ${status.toLocaleLowerCase()}`,
              userId: admin.id as string
            }
          })

          const Key = `notification:${notification.userId}:create`;
          console.log("new notification socket:", Key);
          res.socket?.server?.io.emit(Key, notification);
      }))
      return res.status(200).json({result: 'Ok'});
  }


  else {
    // Handle any other HTTP method
    return res.status(405).json({ message: "Invalid HTTP method!" });
  }
}
