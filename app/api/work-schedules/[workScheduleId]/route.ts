import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DeleteWorkScheduleSchema, UpdateWorkScheduleSchema } from "@/schema/work-schedule";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {
      const { workScheduleId } = params;

      const workSchedule = await prisma.workSchedule.findUnique({
        where: {
          id: workScheduleId,
          isArchived: false,
        },
      });

      if (!workSchedule) {
        return NextResponse.json("Event not found", { status: 404 });
      }
      const body = await UpdateWorkScheduleSchema.safeParseAsync(
        await req.json()
      );

      if (!body.success) {
        console.log("[EVENT_PATCH]", body.error);
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }
      const { title, start, end, allDay } = body.data;

      const updatedWorkSchedule = await prisma.workSchedule.update({
        where: {
          id: workScheduleId,
        },
        data: {
          title,
          start,
          end,
          allDay,
        },
      });

      return NextResponse.json(updatedWorkSchedule);
    } catch (error) {
      console.log("[EVENTS_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  { requiredRole: ["DOCTOR"] }
);

export const DELETE = withAuth(
  async ({ req, session, params }) => {
    try {
      const { workScheduleId } = params;
      
      const body = await DeleteWorkScheduleSchema.safeParseAsync({
        id: workScheduleId
      });

      if (!body.success) {
        console.log("[EVENT_DELETE]", body.error);
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const workSchedule = await prisma.workSchedule.findUnique({
        where: {
          id: workScheduleId,
          isArchived: false,
        },
      });

      if (!workSchedule) {
        return NextResponse.json("Event not found", { status: 404 });
      }

      
      const deletedWorkSchedule = await prisma.workSchedule.delete({
        where: {
          id: workScheduleId,
        },
      });

      return NextResponse.json(deletedWorkSchedule);
    } catch (error) {
      console.log("[EVENTS_DELETE]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  { requiredRole: ["DOCTOR", "ADMIN"] }
);

export const GET = withAuth(async ({ req, session }) => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const today = moment.utc(date).tz("Asia/Manila").format();

  const searchParams = new URL(req.url).searchParams;
  const userId = searchParams.get("userId");
  const barangayId = searchParams.get("barangayId");
  try {
    const events = await prisma.workSchedule.findMany({
      where: {
        doctorId: userId ?? undefined,
        barangayId: barangayId ?? undefined,
        start: {
          gte: today,
        },
        isArchived: false,
      },
      orderBy: {
        start: "desc",
      },
      include: {
        doctor: {
          include: {
            profile: true,
          },
        },
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.log("[EVENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
});
