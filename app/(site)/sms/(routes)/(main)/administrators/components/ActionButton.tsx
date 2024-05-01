import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
  import { useModal } from "@/hooks/useModalStore";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { TBarangay } from "@/schema/barangay";
import { TUser } from "@/schema/user";
import { Profile } from "@prisma/client";

  import { Archive, MoreHorizontal, Pencil } from "lucide-react";
  import React from "react";
  
  type ActionButtonProps ={
    data: TUser & { profile: Profile, barangay: TBarangay }
  }
  const ActionButton:React.FC<ActionButtonProps> = ({data}) => {
    const {toast} = useToast()
    const deleteAdmin = useMutateProcessor<string, unknown>({
      url: `/users/${data?.id}`,
      method: 'DELETE',
      key: ["Admin"],
    });
    return (
      <div className={`h-full w-full cursor-pointer`}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="h-4 w-4 text-zinc-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
              onClick={() => {
                deleteAdmin.mutate(data?.id, {
                  onSuccess(data, variables, context) {
                    toast({
                      title: 'Admin has been removed'
                    })
                  },
                  onError(data, variables, context) {
                    console.log(data)
                    toast({
                      title: 'Admin did not removed',
                      variant: 'destructive'
                    })
                  },
                })
              }}
            >
              <Archive className="h-4 w-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  export default ActionButton;
  