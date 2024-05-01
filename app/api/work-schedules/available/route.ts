import { CreateWorkScheduleSchema } from "@/schema/work-schedule";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import moment from "moment-timezone";
import { z } from "zod";

export const GET = withAuth(async ({ req, session }) => {
    
  const GetDateSelected = z.object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
    barangayId: z.string().optional()
  });
  
  // @ts-ignore
  // @ts-nocheck
  const queries = Object.fromEntries(req.nextUrl.searchParams.entries());

  const result = await GetDateSelected.safeParseAsync(queries);
  if (!result.success) {
    console.log("Invalid query parameters", result.error.flatten().fieldErrors);
    return new NextResponse("Date is missing", { status: 400 });
  }
  const { day, month, year, barangayId } = result.data;

  const date = new Date();
  date.setDate(Number(day));
  date.setFullYear(Number(year));
  date.setMonth(Number(month));
  
  // get the selected date in appointment calendar

  try {
    const workSchedules = await prisma.workSchedule.findMany({
      include: {
        doctor: true,
      },
      where: {
        OR: [
          {
            start: {
                  lte: moment(date).endOf('day').toDate(),
                },
                end: {
                  gt: moment(date).startOf('day').toDate(),
                },
                barangayId,
                allDay: false
          },
          {
            start: {
                lte: moment(date).startOf('day').toDate(),
              },
              end: {
                gt: moment(date).startOf('day').toDate(),
              },
              barangayId,
              allDay: true
          },
        ]
      }
      
    });

    // console.log('workschedulessss', workSchedules)
    // fetching the doctors that are available
    const doctorsAvailable = await prisma.user.findMany({
      where: {
        id: {
          in: workSchedules.map((workSchedule) => workSchedule.doctorId),
        },
      },
      include: {
        profile: true
      }
    });
    return NextResponse.json(doctorsAvailable);
  } catch (error) {
    console.log("[EVENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
});
