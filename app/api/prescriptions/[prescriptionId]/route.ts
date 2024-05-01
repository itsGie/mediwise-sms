import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UpdatePrescriptionSchema } from "@/schema/prescriptions";
import { NextResponse } from "next/server";

export const DELETE = withAuth(
    async ({ req, session, params }) => {
      try {
        const prescription = await prisma.prescription.findUnique({
            where: {
                id: params?.prescriptionId as string
            }
        })
  
        if (!prescription) {
          return NextResponse.json(
            {
              message: "Prescription not found",
            },
            { status: 404 }
          );
        }
  
        const deletedPrescription = await prisma.prescription.delete({
            where: {
                id: prescription.id
            }
        })
  
        return NextResponse.json(deletedPrescription);
      } catch (error) {
        console.log("[APPOINMENT_DELETE_BY_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
      }
    },
    {
      requiredRole: ["ADMIN", "DOCTOR", "PATIENT"],
    }
  );
  
  export const PATCH = withAuth(
    async ({ req, session, params }) => {
      try {
        const prescriptionId = params?.prescriptionId;
        if (!prescriptionId) {
          return new NextResponse("Prescription ID not found", { status: 404 });
        }
  
        const result = UpdatePrescriptionSchema.safeParse(await req.json());
  
        if (!result.success) {
          return NextResponse.json(
            {
              errors: result.error.flatten().fieldErrors,
              message: "Invalid query parameters",
            },
            { status: 400 }
          );
        }

        const prescription = await prisma.prescription.findUnique({
          where: {
            id: prescriptionId
          }
        });

        if (!prescription) {
          return new NextResponse("Prescription not found", { status: 404 });
        }

        const updatedPrescription = await prisma.prescription.update({
          where: {
            id: prescription.id
          },
          data: {
            ...result.data
          }
        })
        return NextResponse.json(updatedPrescription);
      } catch (error) {
        console.log("[APPOINMENT_DELETE_BY_ID]", error);
        return new NextResponse("Internal error", { status: 500 });
      }
    },
    {
      requiredRole: ["ADMIN", "DOCTOR", "PATIENT"],
    }
  );
  
