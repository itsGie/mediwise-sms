import { withAuth } from "@/lib/auth";
import {
  AppointmentGetQuerySchema,
  CreateAppointmentSchema,
} from "@/schema/appointment";
import { createAppointment, getAppointments } from "@/service/appointment";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";
import prisma from "@/lib/prisma";
import { CreateCategorySchema } from "@/schema/category";
export async function GET(req: NextRequest, { params }: { params: {} }) {
  const categories = await prisma.category.findMany({})

  try {

    
    return NextResponse.json(categories, { status: 200 });

  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const POST = withAuth(
  async ({ req, session }) => {
    try {
      const body = await CreateCategorySchema.safeParseAsync(
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

      const { name,  } =
      body.data;

      const category = await prisma.category.create({
        data: {
          name,
        }
      })

      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      console.log("[CATEGORY_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "PATIENT", "STOCK_MANAGER"],
  }
);
