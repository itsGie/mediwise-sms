import React from "react";
import AuthForm from "../components/AuthForm";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";
const LoginPage = async () => {
  const session = await getSession();

  if (session?.user) {
    return session.user.role === Role.STOCK_MANAGER
      ? redirect(`/sms/dashboard`)
      : redirect(`/mediwise/${session.user.role.toLowerCase()}`);
  }
  return (
    <div className="flex h-screen w-screen justify-center items-center bg-[url(/images/cover-1635816671.png)] bg-cover bg-bottom">
      <div className="w-full h-full absolute bg-[#000000a2]" />
      <AuthForm />
    </div>
  );
};

export default LoginPage;
