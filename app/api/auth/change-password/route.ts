import prisma from "@/lib/prisma";
import { ChangePassword, SetupAccountSchema } from "@/schema/user";
import { generateHashPassword, getUserById } from "@/service/user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest) => {
    try {
      const body = await ChangePassword.safeParseAsync(await req.json());

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
      const user = await getUserById({ id: body.data.userId });

      if (!user || user.vefificationCode !== body.data.code) {
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
          id: user.id,
        },
        data: {
          vefificationCode: null,
          hashedPassword
          }
      });
      return NextResponse.json("account updated", { status: 201 });
    } catch (error) {
      console.log("[ACOOUNT_SETUP_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

