import { withAuth } from "@/lib/auth";
import {
  CreateBrgyItemSchema,
  ItemBrgyGetQuerySchema,
} from "@/schema/item-brgy";
import { createBarangayItem, getAllBarangayItem } from "@/service/item-brgy";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {} }) {
  const queries = getQueryParams(req, ItemBrgyGetQuerySchema);

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
    const item = await getAllBarangayItem({
      name: queries.data.name,
      barangayId: queries.data.barangayId
    });

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.log("[BRGYITEM_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const POST = withAuth(
  async ({ req, session }) => {
    try {
      const body = await CreateBrgyItemSchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const item = await createBarangayItem({
        ...body.data,
      });

      return NextResponse.json(item, { status: 201 });
    } catch (error) {
      console.log("[BRGYITEM_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "STOCK_MANAGER"],
  }
);
