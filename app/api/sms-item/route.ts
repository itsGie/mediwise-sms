import { withAuth } from "@/lib/auth";
import { CreateSmsItemSchema, ItemSmsGetQuerySchema } from "@/schema/item-sms";
import { getAllBarangayItem } from "@/service/item-brgy";

import { createSmsItem, getAllSmsItem } from "@/service/item-sms";
import { getQueryParams } from "@/service/params";
import { NextResponse } from "next/server";

export const GET = withAuth(
  async ({ req, session, params }) => {
    const queries = getQueryParams(req, ItemSmsGetQuerySchema);
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
      const items = await getAllSmsItem({
        name: queries.data.name,
      });

      if (queries.data.barangayId) {
        const brgyItemsLowStock = await getAllBarangayItem({
          barangayId: queries.data.barangayId,
        });

        const getAllMedicineName = brgyItemsLowStock.map((brgyItem) => {
          if (
            (brgyItem.unit === "pcs" && brgyItem?.items?.length! < 25) ||
            (brgyItem.unit === "box" && brgyItem?.items?.length! < 5) ||
            brgyItem?.items?.length! == 0
          ) {
            return brgyItem.name;
          }
        });

        const filteredItems = items.filter((i) => {
          return getAllMedicineName.includes(i.name!);
        });

        console.log("filteredItems", getAllMedicineName, filteredItems.length);
        return NextResponse.json(filteredItems, { status: 200 });
      }

      console.log(items.length)
      return NextResponse.json(items, { status: 200 });
    } catch (error) {
      console.log("[SMSITEM_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
    allowAnonymous: true,
  }
);

export const POST = withAuth(
  async ({ req, session }) => {
    try {
      const body = await CreateSmsItemSchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const item = await createSmsItem({
        ...body.data,
      });

      return NextResponse.json(item, { status: 201 });
    } catch (error) {
      console.log("[SMSITEM_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
  }
);
