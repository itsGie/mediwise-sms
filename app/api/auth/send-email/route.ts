import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateRandomString } from "@/lib/random";
import sendMail from "@/lib/smtp";
import { VerifyEmail, VerifyUserSchema } from "@/schema/user";
import { getUserById, updateProfileById } from "@/service/user";
import handlebars from "handlebars";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from 'fs'
export const POST = async (req:NextRequest) => {
    try {
      const body = await VerifyEmail.safeParseAsync(await req.json());

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
      const user = await prisma.user.findUnique({
        where: {
            email: body.data.email
        }
      })

      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
          },
          { status: 404 }
        );
      }

      const code = generateRandomString(6);
      const profileUpdated = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
        //   isVerified: true,
          vefificationCode: code,
        },
      });

      const source = fs.readFileSync(`${__dirname}/../../../../../../public/template/send-link.html`, 'utf-8').toString()
      const template = handlebars.compile(source)
      const replacement = {
        code,
        email: user?.email,
        link: `${process.env.NEXT_PUBLIC_SITE_URL}/mediwise/change-password?userId=${user?.id}&code=${code}` 
      }
      const content = template(replacement);
      
      sendMail({ content, subject: "Configuration Link", emailTo: user?.email as string });

      return NextResponse.json(profileUpdated, { status: 201 });
    } catch (error) {
      console.log("[VERIFICATION_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

export const GET = async (req: NextRequest) => {
    try {
      const verifyUser = z.object({
        userId: z.string().min(1, "Required"),
        code: z.string().min(1, "Required")
      });
      // @ts-ignore
      // @ts-nocheck
      const queries = Object.fromEntries(req.nextUrl.searchParams.entries());
      const result = await verifyUser.safeParseAsync(queries);
      if (!result.success) {
        console.log(
          "Invalid query parameters",
          result.error.flatten().fieldErrors
        );
        return new NextResponse("UserID not missing", { status: 400 });
      }
    //   const code = generateRandomString(6);

   
      const user = await getUserById({
        id: result.data.userId,
      });

      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }

      if(user.vefificationCode !== result.data.code) {
        return new NextResponse("User not found", { status: 404 });
      }
      console.log("OK")
      return NextResponse.json({ok: true}, {
        status: 200});
    } catch (error) {
      console.log("[VERIFICATION_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
