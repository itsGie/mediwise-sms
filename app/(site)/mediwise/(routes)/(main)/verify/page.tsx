import { getSession } from "@/lib/auth";
import VerifyClient from "./components/VerifyClient";
import { redirect } from "next/navigation";
import { getUserById } from "@/service/user";

const page = async () => {

  const currentUser = await getSession();

  if (!currentUser?.user) {
    return redirect("/mediwise");
  }

  const { user } = currentUser;

  const data = await getUserById({id: user.id})

  if(data?.isVerified) {
    return redirect("/mediwise/setup");
  }

  return (
    <VerifyClient currentUser={data} />
  );
};

export default page;
