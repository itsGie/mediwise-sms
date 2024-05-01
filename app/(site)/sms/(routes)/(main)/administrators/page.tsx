import React from "react";
import AdminClient from "./components/AdminClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { queryFn } from "@/hooks/useTanstackQuery";

const Page = async () => {
  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin"],
    queryFn: () =>
      queryFn({
        url: "/users",
        queryParams: {
          role: 'ADMIN',
        }
      }),
  });
  
  return (
    <div className="h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminClient currentUser={session.user} />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
