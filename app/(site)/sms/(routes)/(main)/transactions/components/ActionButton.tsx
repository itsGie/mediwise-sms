import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import { TItemTransaction } from "@/schema/item-transaction";
import { Barangay } from "@prisma/client";

import { Archive, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type ActionButtonProps = {
  data: TItemTransaction & { barangay: Barangay };
};
const ActionButton: React.FC<ActionButtonProps> = ({ data }) => {
  const router = useRouter();
  return (
    <div className={`h-full w-full cursor-pointer`}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="h-4 w-4 text-zinc-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-xs cursor-pointer hover:bg-zinc-400"
            onClick={() => router.push(`/sms/transactions/${data.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ActionButton;
