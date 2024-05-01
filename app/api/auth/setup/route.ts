import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SetupAccountSchema } from "@/schema/user";
import { generateHashPassword, getUserById } from "@/service/user";
import { NextResponse } from "next/server";

export const POST = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await SetupAccountSchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      // double check if user exists
      const user = await getUserById({ id: session.user.id });

      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
          },
          { status: 404 }
        );
      }

      // hash password
      const hashedPassword = await generateHashPassword(body.data.password);

      // update user
      const profileUpdated = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          hashedPassword: hashedPassword,
          barangayId: body.data.barangayId,
          profile: {
            create: {
              firstname: body.data.firstname,
              lastname: body.data.lastname,
              suffix: body.data.suffix,
              middlename: body.data.middlename,
            }
          }
        },
      });
      console.log(profileUpdated)
      return NextResponse.json("account updated", { status: 201 });
    } catch (error) {
      console.log("[ACOOUNT_SETUP_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: [],
  }
);
