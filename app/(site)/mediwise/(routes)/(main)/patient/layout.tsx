import { getSession } from "@/lib/auth";
import Navbar from "./components/Navbar";
import { redirect } from "next/navigation";
import { getUserById } from "@/service/user";
import { Role } from "@prisma/client";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getSession();

  if (!currentUser?.user) {
    return redirect("/mediwise");
  }

  const { user } = currentUser;

  const data = await getUserById({ id: user.id });

  if (currentUser?.user.role !== Role.PATIENT) {
    return redirect("/mediwise");
  }

  if (!data?.isVerified) {
    return redirect("/mediwise/verify");
  }

  if (!data?.barangayId) {
    return redirect("/mediwise/setup");
  }

  return (
    <main className="h-screen flex  bg-white dark:bg-[#020817] dark:text-white">
      <div className=" fixed inset-x-0 top-0 z-50 h-full max-h-[80px]">
        <Navbar currentUser={data} />
      </div>
      <div className="w-full overflow-scroll mt-[100px]">{children}</div>
    </main>
  );
};

export default Layout;
