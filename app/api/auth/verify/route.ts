import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateRandomString } from "@/lib/random";
import sendMail from "@/lib/smtp";
import { VerifyUserSchema } from "@/schema/user";
import { getUserById, updateProfileById } from "@/service/user";
import handlebars from "handlebars";
import { NextResponse } from "next/server";
import { z } from "zod";
import fs from 'fs'
export const POST = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await VerifyUserSchema.safeParseAsync(await req.json());

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

      // check if code is equal to user's vefificationCode
      if (user.vefificationCode !== body.data.code) {
        return NextResponse.json(
          {
            message: "Invalid verification code",
          },
          { status: 400 }
        );
      }
      // error

      /*
        [VERIFICATION_POST] PrismaClientUnknownRequestError: 
        Invalid `prisma.profile.update()` invocation:


        Unknown nested field 'profile' for operation updateOneProfile does not match any query.
            at si.handleRequestError (D:\rootfolder\nextJs-adventure\mediwise-sms\node_modules\@prisma\client\runtime\library.js:125:7007)
            at si.handleAndLogRequestError (D:\rootfolder\nextJs-adventure\mediwise-sms\node_modules\@prisma\client\runtime\library.js:125:6151)
            at si.request (D:\rootfolder\nextJs-adventure\mediwise-sms\node_modules\@prisma\client\runtime\library.js:125:5859)
            at async l (D:\rootfolder\nextJs-adventure\mediwise-sms\node_modules\@prisma\client\runtime\library.js:130:10025)
            at async updateProfileById (webpack-internal:///(rsc)/./service/user.ts:127:12)
            at async POST.requiredRole (webpack-internal:///(rsc)/./app/api/auth/verify/route.ts:51:32)
            at async D:\rootfolder\nextJs-adventure\mediwise-sms\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63251 {
          clientVersion: '5.7.1'
        }
      */
     
      //   update user status to verified
      // const profileUpdated = await updateProfileById({
      //   id: session.user.id,
      //   isVerified: true,
      // });

      const profileUpdated = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          isVerified: true,
          vefificationCode: null,
        },
      });

      return NextResponse.json(profileUpdated, { status: 201 });
    } catch (error) {
      console.log("[VERIFICATION_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: [],
  }
);

export const GET = withAuth(
  async ({ req, session, params }) => {
    try {
      const GetUserIdSchema = z.object({
        userId: z.string(),
      });
      // @ts-ignore
      // @ts-nocheck
      const queries = Object.fromEntries(req.nextUrl.searchParams.entries());
      const result = await GetUserIdSchema.safeParseAsync(queries);

      if (!result.success) {
        console.log(
          "Invalid query parameters",
          result.error.flatten().fieldErrors
        );
        return new NextResponse("UserID not missing", { status: 400 });
      }
      const code = generateRandomString(6);

   
      const user = await getUserById({
        id: result.data.userId,
      });

      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          vefificationCode: code,
        },
      });
      const source = fs.readFileSync(`${__dirname}/../../../../../../public/template/send-code.html`, 'utf-8').toString()
      const template = handlebars.compile(source)
      const replacement = {
        code,
        email: user?.email
      }
      const content = template(replacement);
      
      sendMail({ content, subject: "Email verification", emailTo: user?.email as string });

      return new NextResponse("Code has been sent to your email", {
        status: 200,
      });
    } catch (error) {
      console.log("[VERIFICATION_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: [],
  }
);
