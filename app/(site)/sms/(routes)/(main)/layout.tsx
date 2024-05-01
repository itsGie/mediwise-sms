import { getSession } from "@/lib/auth";
import Sidebar from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getUserById } from "@/service/user";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getSession();

  if (!currentUser?.user && currentUser?.user.role !== Role.STOCK_MANAGER) {
    return redirect("/sms");
  }
  const { user } = currentUser;

  const data = await getUserById({ id: user.id });
  
  return (
    <main className=" h-full max-h-screen bg-[#F9FAFC] dark:bg-slate-900 flex justify-center items-center px-5 md:py-10 md:px-20 md:pr-5">
      <div className="h-[80px] md:pl-auto fixed inset-y-0 right-0 w-full z-50">
        <Navbar currentUser={data} />
      </div>
      <div className="hidden md:block h-[90vh] max-h-[90vh] w-80 fixed left-10 top-10 shadow-2xl rounded-xl bg-white overflow-hidden mt-16 md:mt-10">
        <Sidebar currentUser={data} />
      </div>
      <div className="md:ml-80 w-full h-[90vh] max-h-[90vh] shadow-2xl rounded-xl overflow-x-auto bg-white dark:bg-[#020817] dark:text-white mt-16 md:mt-16">
        {children}
      </div>
    </main>
  );
};

export default Layout;
