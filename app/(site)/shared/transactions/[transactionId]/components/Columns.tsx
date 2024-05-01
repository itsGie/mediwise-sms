"use client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Avatar from "@/components/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TItemTransaction, TRequestedItem } from "@/schema/item-transaction";
import { Barangay } from "@prisma/client";
import { TSupplierSchema } from "@/schema/supplier";
import { TItemSms } from "@/schema/item-sms";
import { TItemBrgy } from "@/schema/item-brgy";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const DATE_FORMAT = `MMM d yyyy`;
export const columns: ColumnDef<(TRequestedItem & {item: TItemSms | TItemBrgy })>[] = [
  {
    accessorKey: "id",
    header: () => {
      return <div className="sr-only dark:text-white">Id</div>;
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string;

      return <div className="sr-only dark:text-white">{id}</div>;
    },
  },

  {
    accessorKey: "name",
    accessorFn: (row) => {
      const name = row?.item?.name;
      return name;
    },
    header: ({ column }) => {
      return (
        <div
          className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item name <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const name = row.original.item?.name;
      return (
        <div className=" dark:text-white">
          {name}
        </div>
      );
    },
  },

  {
    accessorKey: "description",
    accessorFn: (row) => {
      const description = row.item?.description;
      return description;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const description = row.original?.item?.description;
      return <div className={` flex items-center line-clamp-1 overflow-y-auto max-w-40 max-h-20`}>{description} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio, nesciunt repudiandae. Alias impedit saepe eveniet eaque possimus odit? Neque tempora nihil, quaerat a fugiat libero quis, necessitatibus laudantium tenetur, veniam rem consequuntur sit quibusdam adipisci. Repudiandae commodi aperiam recusandae doloremque hic alias in voluptatum, cumque reiciendis consectetur laboriosam veritatis fugiat illo at quaerat. Impedit praesentium itaque adipisci est nostrum ipsum optio error dolore quis atque a non, odio quae ut architecto natus dicta vitae tempore, inventore delectus expedita! Ea libero ipsum quaerat eligendi suscipit, obcaecati pariatur nobis totam, distinctio nemo odit sequi, quis aliquam inventore esse aut autem voluptatem iusto.</div>;
    },
  },

  {
    accessorKey: "dosage",
    accessorFn: (row) => {
      const dosage = row.item?.dosage;
      return dosage;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Dosage <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const dosage = row.original?.item?.dosage;
      return <div className={` flex items-center line-clamp-1 overflow-hidden max-w-40`}>{dosage}</div>;
    },
  },

  {
    accessorKey: "quantity",
    accessorFn: (row) => {
      const quantity = row.quantity;
      return quantity;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const quantity = row.original?.quantity;
      return <div className={` flex items-center`}>{quantity}</div>;
    },
  },
];
