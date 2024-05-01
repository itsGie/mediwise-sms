import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getQueryParams } from "@/service/params";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = withAuth(async ({ req, session }) => {
  const GetPatientQueriesSchema = z.object({
    year: z.coerce.number(),
  });

  const queries = getQueryParams(req, GetPatientQueriesSchema);

  if (!queries.success) {
    return NextResponse.json(
      {
        errors: queries.error.flatten().fieldErrors,
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }

  type PatientsRecord = {
    id: number;
    numberOfPatients: number;
    month: string;
  };

  const selectedYear = queries.data.year;
  console.log("🚀 ~ GET ~ selectedYear:", selectedYear);
  const patientPerYear: PatientsRecord[] = [];
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

  // get the number of patients per month
  for (let i = 0; i < months.length; i++) {
    const patients = await prisma.user.findMany({
      where: {
        barangayId: barangayId,
        role: "PATIENT",
        AND: {
          createdAt: {
            gte: new Date(selectedYear, i, 1),
            lt: new Date(selectedYear, i + 1, 1),
          },
        },
      },
    });

    patientPerYear.push({
      id: i,
      numberOfPatients: patients.length,
      month: months[i],
    });
  }

  try {
    return NextResponse.json(patientPerYear, { status: 200 });
  } catch (error) {
    console.log("[DASHBOARD_ADMIN_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
});
