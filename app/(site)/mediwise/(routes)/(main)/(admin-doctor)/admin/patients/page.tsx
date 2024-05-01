import React from "react";
import PatientsClient from "./components/PatientsClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QueryClient } from "@tanstack/react-query";

const page = async () => {
  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }
  const queryClient = new QueryClient();
  return (
    <div className="h-full">
      <PatientsClient currentUser={session.user} />
    </div>
  );
};

export default page;
