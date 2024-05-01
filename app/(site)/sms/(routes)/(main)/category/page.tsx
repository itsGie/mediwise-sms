import React from "react";
import CategoryClient from "./components/CategoryClient";
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
    queryKey: ["category"],
    queryFn: () =>
      queryFn({
        url: "category",
      }),
  });

  return (
    <div className="h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryClient currentUser={session?.user} />
      </HydrationBoundary>
    </div>
  );
};

export default page;
