import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UpdateUserSchema } from "@/schema/user";
import { getQueryParams } from "@/service/params";
import { getUserById, updateUserById } from "@/service/user";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = withAuth(
  async ({ req, session, params }) => {
    try {
      const queryParams = z.object({
        role: z.nativeEnum(Role)
      })
      const queries = getQueryParams(req, queryParams);

  if (!queries.success) {
    return NextResponse.json(
      {
        errors: queries.error.flatten().fieldErrors,
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }
  
      const user = await getUserById({ id: params.userId, role: queries.data.role });

      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    } catch (error) {
      console.log("[USER_GET_BY_ID]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN"],
    allowAnonymous: true,
  }
);

export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await UpdateUserSchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const user = await getUserById({ id: params.userId });

      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
          },
          { status: 404 }
        );
      }

      const userUpdated = await updateUserById({
        id: params.userId,
        data: body.data,
      });

      return NextResponse.json(userUpdated, { status: 201 });
    } catch (error) {
      console.log("[USER_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "PATIENT", "DOCTOR", "STOCK_MANAGER"],
  }
);

export const DELETE = withAuth(
  async ({ req, session, params }) => {
    try {
      const user = await getUserById({ id: params.userId });

      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
          },
          { status: 404 }
        );
      }

      const archivedAdmin = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isArchived:true,
        }
      })
      // const userDeleted = await deleteUserById({ id: params.userId });

      return NextResponse.json(archivedAdmin, { status: 200 });
    } catch (error) {
      console.log("[USER_DELETE]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
  }
);
