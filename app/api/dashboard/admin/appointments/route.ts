import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getQueryParams } from "@/service/params";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = withAuth(async ({ req, session }) => {
  const GetAppoinmentQueriesSchema = z.object({
    year: z.coerce.number(),
    barangayId: z.string().optional()
  });

  const queries = getQueryParams(req, GetAppoinmentQueriesSchema);

  if (!queries.success) {
    return NextResponse.json(
      {
        errors: queries.error.flatten().fieldErrors,
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }

  type AppoinmentsRecord = {
    id: number;
    numberOfAppointments: number;
    month: string;
  };

  const selectedYear = queries.data.year;
  console.log("🚀 ~ GET ~ selectedYear:", selectedYear);
  const appoinmentPerYear: AppoinmentsRecord[] = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const barangayId = session.user.barangayId;

  if (!barangayId) {
    return NextResponse.json(
      {
        errors: "Barangay not found",
        message: "Barangay not found",
      },
      { status: 400 }
    );
  }

  // get the number of appoinments per month
  for (let i = 0; i < months.length; i++) {
    const appoinments = await prisma.appointment.findMany({
      where: {
        barangayId: session.user.barangayId ?? undefined,
        AND: {
          date: {
            gte: new Date(selectedYear, i, 1),
            lt: new Date(selectedYear, i + 1, 1),
          },
          status: "COMPLETED"
        },
      },
    });

    appoinmentPerYear.push({
      id: i,
      numberOfAppointments: appoinments.length,
      month: months[i],
    });
  }

  try {
    return NextResponse.json(appoinmentPerYear, { status: 200 });
  } catch (error) {
    console.log("[DASHBOARD_ADMIN_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
});
