import React from "react";
import RegisterForm from "./components/RegisterForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getSession();
  if (session?.user) {
    return redirect(
      `/mediwise/${session.user.role.toLowerCase()}/appointments`
    );
  }

  return (
    <div className="bg-[#F9FAFC] dark:bg-[#020817] h-screen w-screen flex justify-center items-center">
      <RegisterForm />
    </div>
  );
};

export default page;
