import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
  } from "@tanstack/react-query";
import Calendar from "./components/Calendar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
  const SchedulesPage = async () => {

    const session = await getSession();
    if (!session?.user) {
      return redirect("/");
    }
    
    const queryClient = new QueryClient();
  
    // await queryClient.prefetchQuery({
    //   queryKey: ["events"],
    //   queryFn: () => queryFn("/events"),
    // });
  
    return (
        <div className="flex w-full bg-white p-6 dark:bg-[#020817]">
          <Calendar currentUser={session.user}/>
        </div>
    );
  };
  export default SchedulesPage;
  