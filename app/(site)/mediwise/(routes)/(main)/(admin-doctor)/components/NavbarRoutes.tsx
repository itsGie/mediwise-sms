"use client";

import UserMenu from "@/components/UserMenu";
import UserNotification from "@/components/UserNotification";
import { TGetUserById } from "@/service/user";
import { Session } from "next-auth";

type NavbarRoutesProps = {
  currentUser?: TGetUserById | null;
};

export const NavbarRoutes = ({ currentUser }: NavbarRoutesProps) => {
  return (
    <>
    {/* <div className="dark:bg-[#020817] dark:text-white">NAV LINKS</div> */}

    <div className="flex gap-x-3 ml-auto items-center">
    <div>
        <UserNotification currentUser={currentUser} />
      </div>

      <div className="flex items-center">
        <UserMenu currentUser={currentUser} />
      </div>
      {/* <Link href="/">
        <Button size="sm" variant="ghost">
          <LogOut className="h-4 w-4 mr-2" />
          Exit
        </Button>
      </Link> */}
    </div>
  </>
  );
};
