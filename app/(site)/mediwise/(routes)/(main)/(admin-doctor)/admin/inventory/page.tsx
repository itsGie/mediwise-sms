import React from "react";
import InventoryClient from "./components/InventoryClient";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { queryFn } from "@/hooks/useTanstackQuery";

const page = async () => {
  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["inventory-items", "barangay", session.user.barangayId],
    queryFn: () =>
      queryFn({
        url: "brgy-item",
      }),
  });

  return (
    <div className="h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InventoryClient currentUser={session?.user} />
      </HydrationBoundary>
    </div>
  );
};

export default page;
