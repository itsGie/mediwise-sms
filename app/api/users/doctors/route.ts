import { withAuth } from "@/lib/auth";
import { CreateDoctorSchema, CreateUserSchema, UserGetQuerySchema } from "@/schema/user";
import {
  createUser,
  generateHashPassword,
  getAllUsers,
  getUserByEmail,
} from "@/service/user";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";
import { generateRandomString } from "@/lib/random";
import prisma from "@/lib/prisma";
import sendMail from "@/lib/smtp";


export const POST = withAuth(
  async ({ req, session }) => {
    try {
      const body = await CreateDoctorSchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      // generate random string
      const randomString = generateRandomString(8);
      // hash password
      const hashedPassword = await generateHashPassword(randomString);

      // check if email already exists
      const userExists = await getUserByEmail({ email: body.data.email });

      if (userExists) {
        return NextResponse.json(
          {
            message: "Email already exists",
          },
          { status: 400 }
        );
      }
      const {email, barangay, role, isVerified, ...rest} = body.data
      const user = await prisma.user.create({
        data: {
          email,
          role,
          name:`${{...rest}.firstname} ${{...rest}.lastname}`,
          hashedPassword,
          barangayId: barangay,
          isVerified: isVerified,
          profile: {
            create: {
              ...rest
            }
          }
        },
        include: {
          profile: true
        }
      })
      const content = `
      <div> 
        <h3> Hello Dr. ${user.profile?.firstname} ${user.profile?.lastname} </h3>
  
        <h4> Your account in Mediwise system has been created </h4>
        <p> This is your email and password to open your account </p>

      <section>
        <div> 
          <strong>Email:</strong> <span>${user.email}</span> 
        </div>
        <div> 
          <strong>Password:</strong> <span>${randomString}</span> 
        </div>
        </section>

        <small> - MEDIWISE/SMS ADMIN </small>
      </div>
      `;
  
      sendMail({ content, subject: "Doctor Account Information", emailTo: user?.email as string });
      // TODO: email the accout details to the user

      return NextResponse.json(user, { status: 201 });
    } catch (error) {
      console.log("[USER_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN"],
  }
);
