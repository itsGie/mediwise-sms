import { withAuth } from "@/lib/auth";
import {
  CreateItemTransactionSchema,
  ItemTransactionGetQuerySchema,
} from "@/schema/item-transaction";
import {
  checkIfAllItemsAreAvailable,
  getAllItemTransaction,
} from "@/service/item-transaction";

import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(
  async ({ req, session, params }) => {
    const queries = getQueryParams(req, ItemTransactionGetQuerySchema);

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
      const transaction = await getAllItemTransaction({
        data: queries.data,
      });

      return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
      console.log("[TRANSACTION_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
    allowAnonymous: true,
  }
);