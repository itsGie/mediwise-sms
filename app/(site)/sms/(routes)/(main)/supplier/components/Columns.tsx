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
import ActionButton from "./ActionButton";
import { TItemBrgy } from "@/schema/item-brgy";
import { format } from "date-fns";
import { TSupplierSchema } from "@/schema/supplier";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const DATE_FORMAT = `MMM d yyyy`;
export const columns: ColumnDef<TSupplierSchema>[] = [
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
          Supplier name <ArrowUpDown className="ml-2 h-4 w-4" />
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
    accessorKey: "address",
    accessorFn: (row) => {
      const address = row.address;
      return address;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Address <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const address = row.original?.address;
      return <div className={` flex items-center line-clamp-2`}>{address}</div>;
    },
  },

  {
    accessorKey: "contactPerson",
    accessorFn: (row) => {
      const contactPerson = row.contactPerson;
      return contactPerson;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contact Person <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const contactPerson = row.original?.contactPerson;

      return <div className={` flex items-center`}>{contactPerson}</div>;
    },
  },

  {
    accessorKey: "contactNo",
    accessorFn: (row) => {
      const contactNo = row.contactNo;
      return contactNo;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contact No. <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const contactNo = row.original?.contactNo;

      return <div className={` flex items-center`}>{contactNo}</div>;
    },
  },

  {
    accessorKey: "status",
    accessorFn: (row) => {
      const status = row.status;
      return status;
    },
    header: ({ column }) => {
      return (
        <div
          className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.original?.status;
      return (
        <div> <Badge
              className={cn('', status == 'INACTIVE' && 'bg-rose-500')}
        >{status}</Badge></div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => {
      const createdAt = row.createdAt;
      return createdAt;
    },
    header: ({ column }) => {
      return (
        <div
          className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Onset Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original?.createdAt;
      return (
        <div> {format(new Date(createdAt || new Date()), DATE_FORMAT)}</div>
      );
    },
  },

  // {
  //   accessorKey: "action",
  //   header: ({ column }) => {
  //     return (
  //       <div
  //         className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const createdAt = row.original?.createdAt;
  //     return (
  //       <ActionButton />
  //     );
  //   },
  // },
];
