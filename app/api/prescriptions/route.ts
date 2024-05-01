import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  AppointmentGetQuerySchema,
  CreateAppointmentSchema,
} from "@/schema/appointment";
import { CreatePrescriptionSchema, PrescriptionQuerySchema } from "@/schema/prescriptions";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";
import {ocrSpace} from 'ocr-space-api-wrapper'

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const queries = getQueryParams(req, PrescriptionQuerySchema);

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

    const prescriptions = await prisma.prescription.findMany({
      where: {
        userId: queries.data.userId
      },
      include: {
        user:{
          include: {
            profile:true
          }
        }
      },
      orderBy: {
        createdAt:'desc'
      }
    })
    
    return NextResponse.json(prescriptions, { status: 200 });
  } catch (error) {
    console.log("[BRGYITEM_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export const POST = withAuth(
  async ({ req, session, currentUser }) => {
    try {
      const body = await CreatePrescriptionSchema.safeParseAsync(
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

      const { userId, image, } = body.data;

      const res = await ocrSpace(image, {apiKey: '2227cfc83888957', language:'eng', OCREngine: "2"})

      console.log('prescription text', res)
      const convertedText = res.ParsedResults[0].ParsedText
      console.log(session.user)
      const prescription = await prisma.prescription.create({
        data: {
          userId,
          image,
          convertedText,
          barangayId: currentUser?.barangayId! // fix deploy error 1
        }
      })

      return NextResponse.json(prescription, { status: 201 });
    } catch (error) {
      console.log("[APPOINMENT_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "PATIENT"],
  }
);
