import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  AppointmentGetQuerySchema,
  CreateAppointmentSchema,
} from "@/schema/appointment";
import { CreateEventSchema, EventGetQuerySchema } from "@/schema/event";
import { createAppointment, getAppointments } from "@/service/appointment";
import { getQueryParams } from "@/service/params";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(
    async ({ req, session, currentUser }) => {

  const queries = getQueryParams(req, EventGetQuerySchema);

  if (!queries.success) {
    return NextResponse.json(
      {
        errors: queries.error.flatten().fieldErrors,
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }

    const date = new Date();
    date.setDate(date.getDate() - 1);
    const today = moment.utc(date).tz("Asia/Manila").format();
  
    try {
      const events = await prisma.event.findMany({
        where: {
          start: {
            gte: today,
          },
          isArchived: false,
          barangayId: queries.data.barangayId ?? undefined,
          userId: queries.data.userId ?? undefined
        },
        orderBy: {
          start: "desc",
        },
        include: {
          barangay:true,
          
        }
      });

      return NextResponse.json(events, {status: 200});
    } catch (error) {
      console.log("[EVENTS_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
)

export const POST = withAuth(
  async ({ req, session, currentUser }) => {
    try {
      const body = await CreateEventSchema.safeParseAsync(
        await req.json()
      );
      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const { title, allDay, description, end, id, start, image_url } =
        body.data;

      const event = await prisma.event.create({
        data: {
            description,
            allDay,
            end,
            start,
            image_url,
            title,
            barangayId: currentUser?.barangayId as string
        }
      })

      return NextResponse.json(event, { status: 201 });
    } catch (error) {
      console.log("[EVENTS_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "PATIENT"],
  }
);
