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
import { TItemBrgy } from "@/schema/item-brgy";
import { format } from "date-fns";
import { TSupplierSchema } from "@/schema/supplier";
import { TItemSms } from "@/schema/item-sms";
import { Item } from "@prisma/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const DATE_FORMAT = `MMM d yyyy`;
export const columns: ColumnDef<TItemBrgy & {items: Item[]}>[] = [
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
      const name = row.name;
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
      const name = row.original.name;
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
      const description = row.description;
      return description;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description & Dosage  <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const description = row.original?.description;
      const dosage = row.original?.dosage;

      return <div className={` flex items-center line-clamp-1 overflow-hidden max-w-40`}>{description} - {dosage || 'N/A'}</div>;
    },
  },

  {
    accessorKey: "stock",
    accessorFn: (row) => {
      const stock = row.stock;
      return stock;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stock <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const stock = row.original?.stock;
      const unit = row.original?.unit;
      return <div className={` flex items-center`}>{stock} {unit}</div>;
    },
  },
    // {
    //   accessorKey: "dosage",
    //   accessorFn: (row) => {
    //     const dosage = row?.dosage;
    //     return dosage;
    //   },
    //   header: ({ column }) => (
    //     <div
    //       className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Dosage <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     const dosage = row.original?.dosage;

    //     return <div className={` flex items-center`}>{dosage || 'N/A'}</div>;
    //   },
    // },

  // {
  //   accessorKey: "supplier",
  //   accessorFn: (row) => {
  //     const supplier = row?.supplier.name;
  //     return supplier;
  //   },
  //   header: ({ column }) => (
  //     <div
  //       className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Supplier <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const supplier = row.original?.supplier?.name;
  //     return <div className={` flex items-center`}>{supplier|| 'N/A'}</div>;
  //   },
  // },

];
