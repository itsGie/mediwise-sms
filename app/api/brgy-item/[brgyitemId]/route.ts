import { withAuth } from "@/lib/auth";
import { UpdateBrgyItemSchema } from "@/schema/item-brgy";
import {
  deleteBarangayItemById,
  getBarangayItemById,
  updateBarangayItemById,
} from "@/service/item-brgy";
import { NextResponse } from "next/server";

export const GET = withAuth(
  async ({ req, session, params }) => {
    try {
      const item = await getBarangayItemById(params.brgyitemId);

      if (!item) {
        return NextResponse.json(
          {
            message: "Brgy Item not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(item);
    } catch (error) {
      console.log("[BRGYITEM_GET_BY_ID]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "STOCK_MANAGER"],
    allowAnonymous: true,
  }
);

export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await UpdateBrgyItemSchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const item = await getBarangayItemById(params.brgyitemId);

      if (!item) {
        return NextResponse.json(
          {
            message: "Item not found",
          },
          { status: 404 }
        );
      }

      const itemUpdated = await updateBarangayItemById(params.brgyitemId, {
        name: body.data.name,
        description: body.data.description,
        unit: body.data.unit,
        category_id: body.data.category_id,
        dosage: body?.data?.dosage
      });

      return NextResponse.json(itemUpdated, { status: 201 });
    } catch (error) {
      console.log("[BRGYITEM_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "STOCK_MANAGER"],
  }
);

export const DELETE = withAuth(
  async ({ req, session, params }) => {
    try {
      const item = await getBarangayItemById(params.brgyitemId);

      if (!item) {
        return NextResponse.json(
          {
            message: "Item not found",
          },
          { status: 404 }
        );
      }

      const itemDeleted = await deleteBarangayItemById(params.brgyitemId);

      return NextResponse.json(itemDeleted, { status: 200 });
    } catch (error) {
      console.log("[ITEM_DELETE]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "DOCTOR", "STOCK_MANAGER"],
  }
);
