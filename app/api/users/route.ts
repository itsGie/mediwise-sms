import { withAuth } from "@/lib/auth";
import { CreateUserSchema, UserGetQuerySchema } from "@/schema/user";
import {
  createUser,
  generateHashPassword,
  getAllUsers,
  getUserByEmail,
} from "@/service/user";
import { getQueryParams } from "@/service/params";
import { NextRequest, NextResponse } from "next/server";
import { generateRandomString } from "@/lib/random";

export const GET = withAuth(
  async ({ req, session }) => {
    const queries = getQueryParams(req, UserGetQuerySchema);

    if (!queries.success) {
      return NextResponse.json(
        {
          errors: queries.error.flatten().fieldErrors,
          message: "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { name, email, role, barangayId} = queries.data;

    try {
      const users = await getAllUsers({
        name: name,
        email: email,
        role: role,
        barangayId: barangayId,
      });

      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      console.log("[USER_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "PATIENT", "STOCK_MANAGER"],
  }
);

export const POST = withAuth(
  async ({ req, session }) => {
    try {
      const body = await CreateUserSchema.safeParseAsync(await req.json());

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

      // create user
      const user = await createUser({
        data: {
          ...body.data,
          email: body.data.email,
          role: body.data.role,
          hashedPassword: hashedPassword,
          vefificationCode: randomString
        },
      });

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
