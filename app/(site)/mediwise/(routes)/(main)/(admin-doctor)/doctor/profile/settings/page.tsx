import React from "react";
import UserCardForm from "./components/UserCardForm";
import GeneralInfoForm from "./components/GeneralInfoForm";
import PasswordsForm from "./components/PasswordsForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/service/user";

const UserSettingsPage = async () => {
  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }

  const user = await getUserByEmail({email: session?.user.email as string})
  
  return (
    <div className="flex flex-col p-5 gap-3 dark:bg-transparent bg-[#F9FAFB]">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-col gap-3 flex-[0.4]">
          <UserCardForm 
          // @ts-ignore
          // @ts-nocheck
          data={user} />
          <PasswordsForm 
          // @ts-ignore
          // @ts-nocheck
          data={user} />
        </div>
        <div className="flex-1">
          <GeneralInfoForm 
          // @ts-ignore
          // @ts-nocheck
          data={user} />
        </div>
      </div>
      {/* <GuardianInfoForm data={user} studentProfileId={user?.profile?.id} /> */}
      {/* <WorkExperiences data={user} /> */}
    </div>
  );
};

export default UserSettingsPage;
