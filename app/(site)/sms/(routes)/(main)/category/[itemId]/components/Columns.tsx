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
import { Item, Profile } from "@prisma/client";
import { format } from "date-fns";
import ActionButton from "./ActionButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const DATE_FORMAT = `MMM d yyyy`;

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => {
      const id = row?.id;
      return id;
    },
    header: () => {
      return <div className="sr-only dark:text-white">Id</div>;
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="sr-only dark:text-white">{id}</div>;
    },
  },
  {
    accessorKey: "productNo.",
    accessorFn: (row) => {
      const product_number = row?.product_number;
      return product_number;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product No. <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const product_number = row.original?.product_number as string;
      return <div className="">{product_number || "N/A"}</div>;
    },
  },
  {
    accessorKey: "expiration_date",
    accessorFn: (row) => {
      const expiration_date = row?.expiration_date;
      return expiration_date;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Expiration Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const expiration_date = row.original?.expiration_date
      return <div className="">
      {format(new Date(expiration_date || new Date()), DATE_FORMAT)}
    </div>
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
          CreatedAt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original?.createdAt;
      return (
        <div className="">
          {format(new Date(createdAt || new Date()), DATE_FORMAT)}
        </div>
      );
    },
  },

  {
    accessorKey: "updatedAt",
    accessorFn: (row) => {
      const updatedAt = row.updatedAt;
      return updatedAt;
    },
    header: ({ column }) => {
      return (
        <div
          className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        ></div>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.original?.updatedAt;
      // @ts-ignore
      // @ts-nocheck
      return <ActionButton data={row.original} />;
    },
  },
];
