import React from "react";
import HistoryClient from "./components/HistoryClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/service/user";

const page = async () => {
  const session = await getSession();

  if (!session?.user) {
    return redirect("/mediwise");
  }

  const { user } = session;

  const currentUser = await getUserById({ id: user.id });
  if (!currentUser) {
    return redirect("/mediwise");
  }
  return (
    <div className="h-full">
      <HistoryClient currentUser={currentUser} />
    </div>
  );
};

export default page;
