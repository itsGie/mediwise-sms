import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/utils";
import { UpdateTimeAndDateEventSchema } from "@/schema/event";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(
  async ({ req, session, currentUser, params }) => {

  const { eventId } = params;

  try {
    const events = await prisma.event.findUnique({
      where: {
        id: eventId,
        isArchived: false,
      },
    });

    if (!events) {
      return NextResponse.json("Event not found", { status: 404 });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.log("[EVENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
})

export const PATCH = withAuth(
  async ({ req, session, currentUser, params }) => {

  const { eventId } = params;

  const events = await prisma.event.findUnique({
    where: {
      id: eventId,
      isArchived: false,
    },
  });

  if (!events) {
    return NextResponse.json("Event not found", { status: 404 });
  }

  const result = await UpdateTimeAndDateEventSchema.safeParseAsync(await req.json());

  if (!result.success) {
    console.log("[EVENT_PATCH]", result.error);
    return NextResponse.json(
      {
        errors: result.error.flatten().fieldErrors,
        message: "Invalid body parameters",
      },
      { status: 400 }
    );
  }

  const { title, start, end, allDay } = result.data;

  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        start: start,
        end: end,
        allDay,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.log("[EVENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
})

export const DELETE = withAuth(
  async ({ req, session, currentUser, params }) => {

  const { eventId } = params;

  const events = await prisma.event.findUnique({
    where: {
      id: eventId,
      isArchived: false,
    },
  });

  if (!events) {
    return NextResponse.json("Event not found", { status: 404 });
  }

  try {
    const archivedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(archivedEvent);
  } catch (error) {
    console.log("[EVENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
})
