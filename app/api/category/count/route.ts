import { withAuth } from "@/lib/auth";
import {
  AppointmentGetQuerySchema,
  CreateAppointmentSchema,
} from "@/schema/appointment";
import { createAppointment, getAppointments } from "@/service/appointment";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";
import prisma from "@/lib/prisma";
import { CreateCategorySchema } from "@/schema/category";
import { z } from "zod";
export async function GET(req: NextRequest, { params }: { params: {} }) {
  try {
    const queries = getQueryParams(req,z.object({
        barangayId: z.string().optional()
    }) );
  if (!queries.success) {

    return NextResponse.json(
      {
        errors: queries.error.flatten().fieldErrors,
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }
    const categories = await prisma.category.findMany()
    let categoryObj:any = {}
    categories.map((category) => {
        categoryObj[category.id] = category.name
    })

    const barangayItemsCountByCategory = await prisma.brgyItem.groupBy({
        by: ['category_id'],
        _count: {
            // id:true,
            category_id:true            
        },
        where: {
            isArchive: false, // Assuming you want to include only non-archived items
            barangayId: queries.data.barangayId ?? undefined
        }
    });
    const categoriesCount = barangayItemsCountByCategory.map(item => {
        if(item?.category_id) {
            const categoryName = categoryObj[item.category_id]
            console.log(`${categoryName} = ${item._count.category_id}`);

            return {
                categoryName,
                count: item._count.category_id
            }
        }
    });
    
    return NextResponse.json(categoriesCount.filter((data) => !!data), { status: 200 });

  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


