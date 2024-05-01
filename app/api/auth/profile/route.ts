import { withAuth } from "@/lib/auth";
import {
  ChangePasswordSchema,
  TUser,
  TUserRaw,
  UpdateProfileSchema,
} from "@/schema/user";
import {
  comparePassword,
  generateHashPassword,
  getUserById,
  updateProfileById,
  updateUserPasswordById,
} from "@/service/user";
import { NextResponse } from "next/server";

/* 
  CHANGE PASSWORD 
*/
export const PUT = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await ChangePasswordSchema.safeParseAsync(await req.json());

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

      const user = await getUserById({
        id: session.user.id,
      });

      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
          },
          { status: 404 }
        );
      }

      // check if old password is correct
      if (user.hashedPassword) {
        const isPasswordMatched = await comparePassword(
          body.data.oldPassword,
          user.hashedPassword
        );

        if (!isPasswordMatched) {
          return NextResponse.json(
            {
              errors: {
                oldPassword: ["Old password is incorrect"],
              },
              message: "Invalid body parameters",
            },
            { status: 400 }
          );
        }
      }

      // hash new password
      const hashedPassword = await generateHashPassword(body.data.newPassword);

      // update current user profile
      const userUpdated = await updateUserPasswordById({
        id: session.user.id,
        hashedPassword: hashedPassword,
      });

      return NextResponse.json(userUpdated, { status: 201 });
    } catch (error) {
      console.log("[PROFILE_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: [],
  }
);

/* 
  UPDATE PROFILE
*/
export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await UpdateProfileSchema.safeParseAsync(await req.json());

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

      // update current user profile
      const profileUpdated = await updateProfileById({
        id: session.user.id,
        ...body.data,
      });

      return NextResponse.json(profileUpdated, { status: 201 });
    } catch (error) {
      console.log("[PROFILE_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: [],
  }
);
