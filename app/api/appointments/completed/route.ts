import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  AppointmentGetQuerySchema,
  CreateAppointmentSchema,
} from "@/schema/appointment";
import { createAppointment, getAppointments } from "@/service/appointment";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const queries = getQueryParams(req, AppointmentGetQuerySchema);
  if (!queries.success) {
    return NextResponse.json(
      {
        errors: queries.error.flatten().fieldErrors,
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: queries.data.doctorId,
        status: 'COMPLETED'
      }
    })

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.log("[APPOINMENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
