import React from "react";
import DoctorsClient from "./components/DoctorsClient";
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
    queryKey: ["doctors", 'barangay', session.user.barangayId],
    queryFn: () =>
      queryFn({
        url: "/users",
        queryParams: {
          role: 'DOCTOR',
          barangayId: session.user.barangayId
        }
      }),
  });
  
  return (
    <div className="h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DoctorsClient currentUser={session.user} />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
