import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
import { z } from "zod";

export const GET = withAuth(
  async ({ req, session, params }) => {
    const nofiticationParams = z.object({
      userId: z.string().optional(),
    });
    const queries = getQueryParams(req, nofiticationParams);

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
      const notifications = await prisma.notification.findMany({
        where: {
          userId: queries.data.userId,
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          Item:{
            include: {
              brgyItem:true,
            }
          },
          appointment:true,
          transaction:true,
          user:true,
        }
      });

      console.log("notf",notifications)

      return NextResponse.json(notifications, { status: 200 });
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
