import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { useModal } from "@/hooks/useModalStore";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { TItemBrgy } from "@/schema/item-brgy";
import { Item } from "@prisma/client";

  import { Archive, Box, MoreHorizontal, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
  import React from "react";
  
  type ActionButtonProps = {
    data: Item
  }
  const ActionButton:React.FC<ActionButtonProps> = ({data}) => {
    //   const {onOpen} = useModal()

      const deleteItem = useMutateProcessor<string, any>({
        url: `/brgy-item/${data.brgyItemId}/item/${data?.id}`,
        method: 'DELETE',
        key: ['brgy-item', data.brgyItemId]
      })

    return (
      <div className={`h-full w-full cursor-pointer`}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="h-4 w-4 text-zinc-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
              onClick={() => deleteItem.mutate(data.id)}
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
  