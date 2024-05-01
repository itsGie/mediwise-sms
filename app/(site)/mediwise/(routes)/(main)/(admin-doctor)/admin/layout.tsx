import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getSession();

  if (currentUser?.user.role !== Role.ADMIN) {
    return redirect("/mediwise");
  }

  return <>{children}</>

}

export default Layout