import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Calendar from "./components/Calendar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/service/user";

const AppointmentPage = async () => {
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
    <div className="flex w-full dark:bg-[#020817] px-5 md:px-10">
      <Calendar currentUser={currentUser} />
    </div>
  );
};
export default AppointmentPage;
