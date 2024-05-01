import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getUserById } from "@/service/user";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getSession();

  if (!currentUser?.user) {
    return redirect("/mediwise");
  }

  const { user } = currentUser;

  const data = await getUserById({ id: user.id });

  if (currentUser?.user.role !== Role.DOCTOR) {
    return redirect("/mediwise");
  }

  if (!data?.isVerified) {
    return redirect("/mediwise/verify");
  }

  if (!data?.barangayId) {
    return redirect("/mediwise/setup");
  }

  return <>{children}</>

}

export default Layout