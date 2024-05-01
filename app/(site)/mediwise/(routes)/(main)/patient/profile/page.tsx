import GeneralUserInfo from "./components/GeneralUserInfo";
import InitialUserInfo from "./components/InitialUserInfo";
import { UserCog } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserByEmail, getUserById } from "@/service/user";

const Page = async () => {
  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }

  const user = await getUserByEmail({email: session?.user.email as string})
  
  return (
    <div className="flex flex-col p-5 dark:bg-transparent bg-[#F9FAFB]">
      {/* <pre className="hidden dark:block dark:text-white text-black dark:bg-gray-800 bg-gray-100 p-5 rounded-md overflow-auto">
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre> */}
      <div className="flex justify-between items-center">
        <h1 className="my-5 text-3xl">Profile</h1>
        <Link href={`/mediwise/${user?.role.toLowerCase()}/profile/settings`}>
          <UserCog />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <InitialUserInfo 
          // @ts-ignore
          // @ts-nocheck
          data={user} />
          <GeneralUserInfo 
          // @ts-ignore
          // @ts-nocheck
          data={user} />
        </div>
      </div>
    </div>
  );
};
export default Page;
