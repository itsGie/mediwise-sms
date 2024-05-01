import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  AppointmentGetQuerySchema,
  CreateAppointmentSchema,
} from "@/schema/appointment";
import { CreateSupplierSchema } from "@/schema/supplier";
import { createAppointment, getAppointments } from "@/service/appointment";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  try {

    const suppliers = await prisma.supplier.findMany({
      include: {
        smsItems:{
          include: {
            items:true
          }
        }
      }
    })
    return NextResponse.json(suppliers, { status: 200 });
  } catch (error) {
    console.log("[SUPPLIER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const POST = withAuth(
  async ({ req, session }) => {
    try {
      const body = await CreateSupplierSchema.safeParseAsync(await req.json());
      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const supplier = await prisma.supplier.create({
        data: { ...body.data },
      });

      return NextResponse.json(supplier, { status: 201 });
    } catch (error) {
      console.log("[SUPPLIER_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["STOCK_MANAGER"],
  }
);
