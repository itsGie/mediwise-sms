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
  
    try {
      const barangays = await prisma.barangay.findMany({
        include: {
            ItemTransaction:{
                include: {
                    requested_items: {
                        include: {
                            item:true
                        }
                    }
                }
            }
        }
      })

        // Separate data by month
    const separatedData:any = [
      {
        month:0,
        data: []
      },
      {
        month:1,
        data: []
      },
      {
        month:2,
        data: []
      },
      {
        month:3,
        data: []
      },
      {
        month:4,
        data: []
      },
      {
        month:5,
        data: []
      },
      {
        month:6,
        data: []
      },
      {
        month:7,
        data: []
      },
      {
        month:8,
        data: []
      },
      {
        month:9,
        data: []
      },
      {
        month:10,
        data: []
      },
      {
        month:11,
        data: []
      },
    ];

    // barangays.forEach(barangay => {
    //   barangay.ItemTransaction.forEach(transaction => {
    //     const month = new Date(transaction.createdAt).getMonth();
    //     separatedData[month].data.push(barangay);
    //   });
    // });

      return NextResponse.json(barangays, { status: 200 });
    } catch (error) {
      console.log("[BARANGAY_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }