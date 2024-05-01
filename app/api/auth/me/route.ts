import { withAuth } from "@/lib/auth";
import { getUserById } from "@/service/user";
import { NextResponse } from "next/server";

/* 
  GET CURRENT USER PROFILE
*/
export const GET = withAuth(async ({ session }) => {
  const user = await getUserById({ id: session.user.id });
  return NextResponse.json(user);
});
