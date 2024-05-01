import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";
import { signOut } from "next-auth/react";
import { capitalizeWords } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Session } from "next-auth";
import Avatar from "./Avatar";
import { TGetUserById } from "@/service/user";

type UserMenuProps = {
  currentUser?: TGetUserById | null;
};
const UserMenu = ({ currentUser }: UserMenuProps) => {
  const router = useRouter();

  const url = currentUser?.role === 'STOCK_MANAGER' ? '/sms/profile' : `/mediwise/${currentUser?.role.toLowerCase()}/profile`
  
  console.log(currentUser)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="
          p-[2px]
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          justify-center
          rounded-full 
          cursor-pointer 
          hover:shadow-md t
          transition"
        >
          <div className=" relative w-10 h-10">
            {/* <Image
              src={(currentUser?.image?.includes('https://platform-lookaside.fbsbx.com/platform/profilepic') ? null : currentUser?.image as string) || `/images/placeholder.jpg`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-full object-cover"
              alt="profile image"
            /> */}
            <Avatar src={currentUser?.role === 'STOCK_MANAGER' ? '/images/Clogo.png' : currentUser?.image} />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {capitalizeWords(currentUser?.role!)} {(currentUser?.role !== 'STOCK_MANAGER' && currentUser?.barangay?.name) && `- ${currentUser?.barangay?.name}` }
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          currentUser?.role !== 'STOCK_MANAGER' && <DropdownMenuItem onClick={() => router.push(url)}>Profile</DropdownMenuItem>
        }
        
        <DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserMenu;
