import React from "react";
import AppoinmentsDetailClient from "./components/AppoinmentsDetailClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/service/user";
import { QueryClient } from "@tanstack/react-query";

const page = async () => {
  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }
  const currentUser = await getUserById({ id: session.user.id });

  if (!currentUser) {
    return redirect("/");
  }

  const queryClient = new QueryClient();

  return (
    <div className="p-3 md:p-10">
      <AppoinmentsDetailClient currentUser={currentUser} />
    </div>
  );
};

export default page;
