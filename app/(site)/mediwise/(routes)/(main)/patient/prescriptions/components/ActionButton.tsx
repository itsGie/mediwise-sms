import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { useModal } from "@/hooks/useModalStore";
import { TPrescriptionSchema } from "@/schema/prescriptions";

  import { Archive, Eye, MoreHorizontal, Pencil,  } from "lucide-react";
import { Profile, User} from "next-auth";
  import React from "react";
  
  type ActionButtonProps = {
    data: (TPrescriptionSchema & {user: User & { profile: Profile}})
  }
  
  const ActionButton:React.FC<ActionButtonProps> = ({data}) => {
    const { onOpen } = useModal()
    return (
      <div className={`h-full w-full cursor-pointer`}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="h-4 w-4 text-zinc-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-xs cursor-pointer hover:bg-zinc-400"
              onClick={() => onOpen('viewPrescription', {prescription: data})}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
              onClick={() => onOpen('deletePrescription', {prescription: data})}
              
            >
              <Archive className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  export default ActionButton;
  