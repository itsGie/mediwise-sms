import { apiClient } from "@/hooks/useTanstackQuery";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateAppointmentPrescriptionSchema, UpdateAppointmentSchema } from "@/schema/appointment";
import {
  deleteAppointmentById,
  getAppointmentById,
  updateAppointmentById,
} from "@/service/appointment";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      appointmentId: string;
    };
  }
) {
  try {
    const appointment = await getAppointmentById({
      id: params.appointmentId,
    });

    if (!appointment) {
      return NextResponse.json(
        {
          message: "Appointment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.log("[APPOINMENT_GET_BY_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {
      const appointments = await getAppointmentById({
        id: params.appointmentId,
      });

      if (!appointments) {
        return NextResponse.json(
          {
            message: "Appointment not found",
          },
          { status: 404 }
        );
      }

      const body = await UpdateAppointmentSchema.safeParseAsync(
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

      const { title, doctorId, patientId, date, status, image_path } =
        body.data;

      const appointmentUpdated = await updateAppointmentById({
        id: params.appointmentId,
        title,
        doctorId,
        patientId,
        date,
        status,
        image_path,
      });

      return NextResponse.json(appointmentUpdated, { status: 200 });
    } catch (error) {
      console.log("[APPOINMENT_PATCH_BY_ID]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "PATIENT"],
  }
);


export const PUT = withAuth(
  async ({ req, session, params }) => {
    try {
      const appointments = await getAppointmentById({
        id: params.appointmentId,
      });

      if (!appointments) {
        return NextResponse.json(
          {
            message: "Appointment not found",
          },
          { status: 404 }
        );
      }

      const body = await CreateAppointmentPrescriptionSchema.safeParseAsync(
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

      const appointment = await prisma.appointment.update({
        where: {
          id: appointments.id
        },
        data: {
          image_path: body.data.image
        }
      })

      console.log(process.env.NEXT_PUBLIC_SITE_URL)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/notifications/prescriptions`, {
        appointmentId: appointment.id,
        userId: appointment.patientId
      })

      console.log(res.data)
      return NextResponse.json(appointment, { status: 200 });
    } catch (error) {
      console.log("[APPOINMENT_PUT_BY_ID]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "PATIENT"],
  }
);

export const DELETE = withAuth(
  async ({ req, session, params }) => {
    try {
      const appointments = await getAppointmentById({
        id: params.appointmentId,
      });

      if (!appointments) {
        return NextResponse.json(
          {
            message: "Appointment not found",
          },
          { status: 404 }
        );
      }

      if(appointments.status === 'ACCEPTED') {
        const appoinmentCancelled = await prisma.appointment.update({
          where: {
            id: appointments.id
          },
          data: {
            status: 'CANCELLED',
            isDeleted:true
          }
        })
      return NextResponse.json(appoinmentCancelled);

      }
      const appoinmentDeleted = await prisma.appointment.update({
        where: {
          id: appointments.id
        },
        data: {
          isDeleted:true,
          status: 'CANCELLED',
        }
      })
      return NextResponse.json(appoinmentDeleted);
    } catch (error) {
      console.log("[APPOINMENT_DELETE_BY_ID]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "PATIENT"],
  }
);
