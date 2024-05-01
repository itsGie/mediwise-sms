import { Session } from "next-auth";
import { MobileSidebar } from "./MobileSidebar";
import { NavbarRoutes } from "./NavbarRoutes";
import { TGetUserById } from "@/service/user";

type NavbarProps = {
  currentUser: TGetUserById | null;
};

export const Navbar = ({ currentUser }: NavbarProps) => {
  return (
    <div
      // className="p-4 border-b h-full flex items-center bg-white shadow-sm dark:bg-[#020817] dark:text-white"
      className="px-4 border-none border-0 h-full flex items-center bg-transparent dark:text-white"
    >
      <MobileSidebar currentUser={currentUser} />
      <NavbarRoutes currentUser={currentUser} />
    </div>
  );
};
