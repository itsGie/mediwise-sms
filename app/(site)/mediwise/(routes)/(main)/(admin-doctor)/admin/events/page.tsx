import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Calendar from "./components/Calendar";
import { queryFn } from "@/hooks/useTanstackQuery";
import { isUserAllowed } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

type EventsPageProps = {};

const EventsPage = async (props: EventsPageProps) => {
  const queryClient = new QueryClient();
  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: ["events"],
    queryFn: () => queryFn({url: '/events'}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex w-full bg-white p-6 dark:bg-[#020817]">
          <Calendar currentUser={session.user} />
      </div>
    </HydrationBoundary>
  );
};
export default EventsPage;
