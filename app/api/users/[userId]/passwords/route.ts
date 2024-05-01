import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { withAuth } from "@/lib/auth";
import { UpdateUsersSchemaWithPassword } from "@/schema/user";

export const PATCH = withAuth(
    async ({ req, session, params }) => {
  
    try {
      const result = UpdateUsersSchemaWithPassword.safeParse(await req.json());
  
      if (!result.success) {
        return NextResponse.json(
          {
            errors: result.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }
      const { userId } = params;
  
      if (!userId) {
        return new NextResponse("User ID missing", { status: 400 });
      }
  
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          isArchived: false,
        },
      });
  
      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }
  
      const {
        email,
        currentPassword,
        password,
        confirmPassword,
        ...rest
      } = result.data;
  
      // if there's a password update
      if (password && currentPassword && confirmPassword) {
        const isMatched = await bcrypt.compare(
          currentPassword,
          user.hashedPassword as string
        );
  
        if (!isMatched) {
          return new NextResponse("Current password do not match", {
            status: 400,
          });
        }
  
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
  
        const updatedPassword = await prisma.user.update({
          where: {
            id: userId as string,
          },
          data: {
            hashedPassword: newPassword,
          },
        });
        const { hashedPassword, ...props } = updatedPassword;
        return NextResponse.json({ ...props });
      }
  
      // else only general information
      const updatedUser = await prisma.user.update({
        where: {
          id: userId as string,
        },
        data: {
          email,
          profile: {
            update: {
              ...rest,
            },
          },
        },
      });
  
      const { hashedPassword, ...props } = updatedUser;
  
      return NextResponse.json({ ...props });
    } catch (error) {
      console.log("[USERS_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  })


  export const PUT = withAuth(
    async ({ req, session, params }) => {
  
    try {
      const result = UpdateUsersSchemaWithPassword.safeParse(await req.json());
  
      if (!result.success) {
        return NextResponse.json(
          {
            errors: result.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }
      const { userId } = params;
  
      if (!userId) {
        return new NextResponse("User ID missing", { status: 400 });
      }
  
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          isArchived: false,
        },
      });
  
      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }
  
      const {
        email,
        currentPassword,
        password,
        confirmPassword,
        ...rest
      } = result.data;
  
      // if there's a password update
      if (password && currentPassword && confirmPassword) {
        const isMatched = await bcrypt.compare(
          currentPassword,
          user.hashedPassword as string
        );
  
        if (!isMatched) {
          return new NextResponse("Current password do not match", {
            status: 400,
          });
        }
  
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
  
        const updatedPassword = await prisma.user.update({
          where: {
            id: userId as string,
          },
          data: {
            hashedPassword: newPassword,
          },
        });
        const { hashedPassword, ...props } = updatedPassword;
        return NextResponse.json({ ...props });
      }
  
      // else only general information
      const updatedUser = await prisma.user.update({
        where: {
          id: userId as string,
        },
        data: {
          email,
          profile: {
            update: {
              ...rest,
            },
          },
        },
      });
  
      const { hashedPassword, ...props } = updatedUser;
  
      return NextResponse.json({ ...props });
    } catch (error) {
      console.log("[USERS_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  })