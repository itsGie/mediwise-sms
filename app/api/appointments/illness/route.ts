import prisma from "@/lib/prisma";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: {} }) {
    try {

    const queries = getQueryParams(req, z.object({
      barangayId: z.string().optional(),
      month: z.coerce.number().optional(),
    }));

    if (!queries.success) {
      
      return NextResponse.json(
        {
          errors: queries.error.flatten().fieldErrors,
          message: "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    
    const { month, barangayId } = queries.data;

    const where:any = {
        illness: {
            notIn: ['', "Rather not to say"],
        },
    };
    
    if (month != null && month >= 0 && month <= 11) {
        const startDate = new Date(new Date().getFullYear(), month, 1).toISOString();
        const endDate = new Date(new Date().getFullYear(), month + 1, 0).toISOString(); // Last day of the month
        where.date = {
            gte: startDate,
            lt: endDate
        };
    }
    
    if (barangayId) {
        where.barangayId = barangayId;
    }
    
    const illness = await prisma.appointment.groupBy({
        by: ['illness'],
        _count: {
            illness: true
        },
        where,
    });
      return NextResponse.json(illness, { status: 200 });
    } catch (error) {
      console.log("[APPOINMENT_ILLNESS_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }