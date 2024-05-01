import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getQueryParams } from "@/service/params";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = withAuth(async ({ req, session }) => {

  // get the number of appointments per month
    const appointments = await prisma.appointment.findMany({
      where: {
        status: "COMPLETED",
      },
    });

  try {
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.log("[EVENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
});
