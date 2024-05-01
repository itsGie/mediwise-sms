import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  BarangayGetQuerySchema,
  CreateBarangaySchema,
} from "@/schema/barangay";
import { createBarangay, getAllBarangay } from "@/service/barangay";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const queries = getQueryParams(req, BarangayGetQuerySchema);

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
    const barangay = await getAllBarangay({
      name: queries.data.name,
    });

    return NextResponse.json(barangay, { status: 200 });
  } catch (error) {
    console.log("[BARANGAY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const POST = withAuth(async ({ req, session }) => {
    try {
      const body = await CreateBarangaySchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const { name , zip, district} = body.data;

      const isExisted = await prisma.barangay.findFirst({
        where: {
          name,
        }
      })

      if(isExisted) {
        return new NextResponse("Barangay already existed", { status: 400 });
      }
      const barangay = await createBarangay({
        name: name,
        zip: zip + '',
        district
      });

      return NextResponse.json(barangay, { status: 201 });
    } catch (error) {
      console.log("[BARANGAY_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["STOCK_MANAGER"],
  }
);
