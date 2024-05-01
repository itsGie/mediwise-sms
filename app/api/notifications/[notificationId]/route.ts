// try {
//     const result = UpdateNotificationSchema.safeParse(req.body);

import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getQueryParams } from "@/service/params";
import { NextResponse } from "next/server";
import { z } from "zod";

//     if (!result.success) {
//       console.log("[NOTIFICATION_POST]", result.error);
//       return res.status(400).json({
//         errors: result.error.flatten().fieldErrors,
//         message: "Invalid body parameter",
//       });
//     }

//     const { isRead } = result.data;

//     const notification = await prisma.notification.update({
//       where: {
//         id: notificationId as string,
//       },
//       data: {
//         isRead: isRead,
//       },
//     });

//     return res.status(200).json(notification);
//   } catch (error) {
//     console.log("[NOTIFICATION_PATCH]", error);
//     return res.status(500).json({ message: "Internal error" });
//   }

export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {

    console.log('helloooo', params)
      const notificationId = params?.notificationId;
      if (!notificationId) {
        return new NextResponse("Notification ID not found", { status: 404 });
      }

      const UpdateNotificationSchema = z.object({
        isRead: z.boolean(),
      });

      const result = UpdateNotificationSchema.safeParse(await req.json());

      if (!result.success) {
        return NextResponse.json(
          {
            errors: result.error.flatten().fieldErrors,
            message: "Invalid query parameters",
          },
          { status: 400 }
        );
      }

      const { isRead } = result.data;

      const notification = await prisma.notification.update({
        where: {
          id: notificationId as string,
        },
        data: {
          isRead: isRead,
        },
      });

      return NextResponse.json(notification, { status: 200 });
    } catch (error) {
      console.log("[NOTIFICATION_ID_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "PATIENT", "STOCK_MANAGER"],
    allowAnonymous: true,
  }
);
