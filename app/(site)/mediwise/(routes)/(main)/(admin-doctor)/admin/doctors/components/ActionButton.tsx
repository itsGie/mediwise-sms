import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import { TUser } from "@/schema/user";

import { Archive, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { Profile } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";

type ActionButtonProps ={
  data: TUser & { profile: Profile }
}
const ActionButton:React.FC<ActionButtonProps> = ({data}) => {
  const router = useRouter()
  return (
    <div className={`h-full w-full cursor-pointer`}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="h-4 w-4 text-zinc-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-xs cursor-pointer hover:bg-zinc-400"
            onClick={() => router.push(`doctors/${data.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ActionButton;
