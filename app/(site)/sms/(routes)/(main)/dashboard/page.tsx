import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import DashboardClient from "./components/DashboardClient";
import { queryFn } from "@/hooks/useTanstackQuery";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

type DashBoardHomePageProps = {
  searchParams: { tab: string };
};

const DashBoardHomePage = async ({ searchParams }: DashBoardHomePageProps) => {

  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dashboard-totals"],
    queryFn: () => queryFn({ url: "" }),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient tab={searchParams.tab} currentUser={session?.user}/>
    </HydrationBoundary>
  );
};
export default DashBoardHomePage;
