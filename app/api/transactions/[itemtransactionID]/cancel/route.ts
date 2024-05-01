import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  TItemTransaction,
  TRequestedItem,
  UpdateItemTransactionSchema,
} from "@/schema/item-transaction";
import {
  checkIfAllItemsAreAvailable,
  deleteItemTransaction,
  getItemTransactionById,
  transferSmsItemsToBarangayItems,
  updateItemTransaction,
} from "@/service/item-transaction";
import { ItemTransactionStatus, Role } from "@prisma/client";
import axios from "axios";
import nodeSchedule from 'node-schedule'

import { NextResponse } from "next/server";

export const DELETE = withAuth(
  async ({ req, session, params }) => {
    try {
      const transaction = await getItemTransactionById({
        id: params.itemtransactionID,
      });

      if (!transaction || !transaction.requested_items) {
        return NextResponse.json(
          {
            message: "Transaction not found",
          },
          { status: 404 }
        );
      }

      const transactionCancelled = await prisma.itemTransaction.update({
        where: {
            id: transaction.id,
        },
        data: {
            status: "CANCELLED",
        }
      })

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/transactions/${transaction.id}`,
        {
          transactionId: transaction.id,
          status: "CANCELLED"
        }
      );

      return NextResponse.json(transactionCancelled, { status: 200 });
    } catch (error) {
      console.log("[ITEMTRANSACTION_DELETE]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["STOCK_MANAGER"],
  }
);
