import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = withAuth(async ({ req, session }) => {
  type WidgetsRecord = {
    appointments: number;
    items: number;
    patients: number;
  };

  let widgetsTotal: WidgetsRecord = {
    appointments: 0,
    items: 0,
    patients: 0,
  };

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

  // get total number of appointments in the barangay
  const appointments = await prisma.appointment.count({
    where: {
      barangayId: barangayId,
    },
  });

  // get total number of unique item in the barangay
  const items = await prisma.brgyItem.count({
    where: {
      barangayId: barangayId,
    },
  });

  // get total number of patients in the barangay
  const patients = await prisma.user.count({
    where: {
      barangayId: barangayId,
      role: "PATIENT",
    },
  });

  widgetsTotal = {
    appointments,
    items,
    patients,
  };

  try {
    return NextResponse.json(widgetsTotal, { status: 200 });
  } catch (error) {
    console.log("[DASHBOARD_ADMIN_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
});
