import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  AppointmentGetQuerySchema,
  CreateAppointmentSchema,
} from "@/schema/appointment";
import { CreateAppointmentItemSchema } from "@/schema/appointment-item";
import {
  createAppointment,
  getAppointmentById,
  getAppointments,
} from "@/service/appointment";
import { getQueryParams } from "@/service/params";
import { Item } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await z
        .array(CreateAppointmentItemSchema)
        .safeParseAsync(await req.json());
      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const appointment = await getAppointmentById({
        id: params.appointmentId,
      });

      if (!appointment || !appointment.barangayId) {
        return NextResponse.json(
          {
            message: "Transaction not found",
          },
          { status: 404 }
        );
      }

      // const formattedAppointmentItems = body.data.map(
      //   (item) => {
      //     return {
      //       quantity: item.quantity,
      //       brgyItemId: item.itemId,
      //       appointmentId: appointment.id
      //     };
      //   }
      // );

      const brgyItem = await prisma.brgyItem.findMany({
        where: {
          id: {
            in: body.data.map((item) => item.itemId) as string[],
          },
        },
        include: {
          items: true,
        },
      });

      const formattedAppointmentItems = body.data.map((item) => {
        const items = brgyItem.find(
          (brgyItem) => brgyItem.id == item.itemId
        )?.items;
        return {
          quantity: item.quantity,
          brgyItemId: item.itemId,
          appointmentId: appointment.id,
          items: items,
        };
      });

      const isNotAvailable = brgyItem.some((item) => {
        const findItem = formattedAppointmentItems.find(
          (formattedItem) => formattedItem.brgyItemId === item.id
        );
        return (
          item.items.length! <= 0 ||
          (findItem && item.items.length! < findItem?.quantity)
        );
      });

      if (isNotAvailable) {
        return NextResponse.json(
          {
            message:
              "Could not proceed to update transaction because some of the requested items are not available or out of stock",
          },
          { status: 400 }
        );
      }

      formattedAppointmentItems.forEach(async (brgyItem) => {
        const items: (Item | null)[] = [];

        for (let i = 0; i < brgyItem.quantity; i++) {
          if (brgyItem?.items) {
            items.push(brgyItem?.items[i]);
          }
        }

        // await prisma.brgyItem.update({
        //   where: {
        //     id: brgyItem.brgyItemId as string,
        //   },
        //   data: {
        //     items: {
        //       deleteMany: items.map((item) => ({ id: item?.id })),
        //     },
        //   },
        // });

        Promise.all(items.map(async(item) => {
          const itemsUpdated = await prisma.item.update({
            where: {
              id: item?.id
            },
            data: {
              brgyItemId: null,
            }
          })

          return itemsUpdated
        }))

        

        const appointmentItems = await prisma.appointment_item.createMany({
          data: [
            ...formattedAppointmentItems.map(
              ({ appointmentId, brgyItemId, quantity }) => ({
                appointmentId,
                brgyItemId,
                quantity,
              })
            ),
          ],
        });
      });

      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: appointment.id,
        },
        data: {
          dispensing_status: "SUPPLIED",
        },
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/notifications/appointment-items`,
        {
          appointmentId: appointment.id,
          userId: appointment.patientId,
        }
      );

      return NextResponse.json(updatedAppointment, { status: 201 });
    } catch (error) {
      console.log("[APPOINMENT_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "PATIENT"],
  }
);
