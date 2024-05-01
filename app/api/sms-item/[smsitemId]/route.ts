import { withAuth } from "@/lib/auth";
import { UpdateSmsItemSchema } from "@/schema/item-sms";

import {
  deleteSmsItemById,
  getSmsItemById,
  updateSmsItemById,
} from "@/service/item-sms";
import { NextResponse } from "next/server";

export const GET = withAuth(
  async ({ req, session, params }) => {
    try {
      const item = await getSmsItemById(params.smsitemId);

      if (!item) {
        return NextResponse.json(
          {
            message: "Sms Item not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(item);
    } catch (error) {
      console.log("[SMSITEM_GET_BY_ID]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
    allowAnonymous: true,
  }
);

export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await UpdateSmsItemSchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const item = await getSmsItemById(params.smsitemId);

      if (!item) {
        return NextResponse.json(
          {
            message: "Item not found",
          },
          { status: 404 }
        );
      }

      const itemUpdated = await updateSmsItemById(params.smsitemId, {
        name: body.data.name,
        description: body.data.description,
        unit: body.data.unit,
        category_id:body.data.category_id
        // stock: body.data.stock,
      });

      return NextResponse.json(itemUpdated, { status: 201 });
    } catch (error) {
      console.log("[SMSITEM_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
  }
);

export const DELETE = withAuth(
  async ({ req, session, params }) => {
    try {
      const item = await getSmsItemById(params.smsitemId);

      if (!item) {
        return NextResponse.json(
          {
            message: "Item not found",
          },
          { status: 404 }
        );
      }

      const itemDeleted = await deleteSmsItemById(params.smsitemId);

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
