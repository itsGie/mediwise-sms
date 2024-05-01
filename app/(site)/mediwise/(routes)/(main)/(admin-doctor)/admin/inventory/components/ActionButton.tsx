import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { useModal } from "@/hooks/useModalStore";
import { TItemBrgy } from "@/schema/item-brgy";

  import { Archive, Box, MoreHorizontal, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
  import React from "react";
  
  type ActionButtonProps = {
    data: TItemBrgy
  }
  const ActionButton:React.FC<ActionButtonProps> = ({data}) => {
      const {onOpen} = useModal()
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
              onClick={() => router.push(`/mediwise/admin/inventory/${data?.id}`)}
            >
              <Box className="h-4 w-4 mr-2" />
              Manage items
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-xs cursor-pointer hover:bg-zinc-400"
              onClick={() => onOpen('updateBarangayItem', {brgyItem: data})}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
              onClick={() => onOpen('deleteBarangayItem', {brgyItem: data})}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  export default ActionButton;
  