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
import { TUser } from "@/schema/user";
import { Profile, appointment_item } from "@prisma/client";
import { format } from "date-fns";
import { TItemBrgy } from "@/schema/item-brgy";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const DATE_FORMAT = `MMM d yyyy`;

export const columns: ColumnDef<appointment_item & {brgyItem:TItemBrgy}>[] = [
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

  // {
  //   accessorKey: "licenseNo",
  //   accessorFn: (row) => {
  //     const licenseNo = row?.profile?.licenseNo;
  //     return licenseNo;
  //   },
  //   header: ({ column }) => (
  //     <div
  //       className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       License No. <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     // const yearEnrolled = row.getValue('') as Date
  //     const licenseNo = row.original?.profile?.licenseNo as string;

  //     return (
  //       <div className="">{licenseNo}</div>
  //     );
  //   },
  // },

  // {
  //   accessorKey: "specialized",
  //   accessorFn: (row) => {
  //     const specialized = row?.profile?.specialist;
  //     return specialized;
  //   },
  //   header: ({ column }) => (
  //     <div
  //       className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Specialized <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     // const yearEnrolled = row.getValue('') as Date
  //     const specialized = row.original?.profile?.specialist as string;

  //     return (
  //       <div className="">{specialized}</div>
  //     );
  //   },
  // },

  {
    accessorKey: "name",
    accessorFn: (row) => {
      const name = row?.brgyItem.name;
      return name;
    },
    header: ({ column }) => {
      return (
        <div
          className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Medicine <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const name = row?.original?.brgyItem.name;
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
      const description = row?.brgyItem.description;
      return description;
    },
    header: ({ column }) => {
      return (
        <div
          className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const description = row?.original?.brgyItem.description;
      return (
        <div className=" dark:text-white">
          {description}
        </div>
      );
    },
  },

  {
    accessorKey: "dosage",
    accessorFn: (row) => {
      const dosage = row?.brgyItem.dosage;

      return `${dosage}`;
    },
    header: ({ column }) => {
      return (
        <div
          className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dosage <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const dosage = row?.original?.brgyItem.dosage;
      return (
        <div className=" dark:text-white">
          {dosage}
        </div>
      );
    },
  },

  {
    accessorKey: "quantity",
    accessorFn: (row) => {
      const quantity = row?.quantity;
      const unit = row?.brgyItem.unit;

      return `${quantity} ${unit}`;
    },
    header: ({ column }) => {
      return (
        <div
          className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const quantity = row?.original?.quantity;
      const unit = row?.original?.brgyItem.unit;
      return (
        <div className=" dark:text-white">
          {quantity}
        </div>
      );
    },
  },

 

   
];
