import { CreateWorkScheduleSchema } from "@/schema/work-schedule";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import moment from "moment-timezone";

// export const GET = withAuth(async ({ req, session }) => {
//   const date = new Date();
//   date.setDate(date.getDate() - 1);
//   const today = moment.utc(date).tz("Asia/Manila").format();

//   const searchParams = new URL(req.url).searchParams;
//   const userId = searchParams.get('userId')
//   const barangayId = searchParams.get('barangayId')
//   try {
//     const events = await prisma.workSchedule.findMany({
//       where: {
//         doctorId: userId ?? undefined,
//         barangayId: barangayId ?? undefined,
//         start: {
//           gte: today,
//         },
//         isArchived: false,
//       },
//       orderBy: {
//         start: "desc",
//       },
//       include: {
//         doctor: {
//           include: {
//             profile:true
//           }
//         },
//       }
//     });
//     return NextResponse.json(events);
//   } catch (error) {
//     console.log("[EVENTS_GET]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// });

export const POST = withAuth(async ({ req, session }) => {
  const result = await CreateWorkScheduleSchema.safeParseAsync(
    await req.json()
  );
  if (!result.success) {
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  const { id, title, allDay, end, start, barangayId, doctorId } = result.data;
  
  try {
    const workSchedule = await prisma.workSchedule.create({
      data: {
        id,
        title,
        allDay,
        start,
        end,
        doctorId: doctorId as string,
        barangayId
      },
    });

    return NextResponse.json(workSchedule);
  } catch (error) {
    console.log("[WORK-SCHEDULE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}, {requiredRole: ['ADMIN']});
