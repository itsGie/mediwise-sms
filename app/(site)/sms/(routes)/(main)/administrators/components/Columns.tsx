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
import { TUser } from "@/schema/user";
import { Profile } from "@prisma/client";
import { format } from "date-fns";
import { TBarangay } from "@/schema/barangay";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const DATE_FORMAT = `MMM d yyyy`;

export const columns: ColumnDef<TUser & { profile: Profile, barangay: TBarangay }>[] = [
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
    accessorKey: "barangay",
    accessorFn: (row) => {
      const barangay = row?.barangay;
      return barangay.name;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Barangay <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const barangayName = row.original?.barangay.name as string;
      return <div className="">{barangayName || "N/A"}</div>;
    },
  },

  {
    accessorKey: "firstname",
    accessorFn: (row) => {
      const firstname = row?.profile?.firstname;
      return firstname;
    },
    header: ({ column }) => {
      return (
        <div
          className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Firstname <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const firstname = row.original?.profile?.firstname;
      return <div className=" dark:text-white">{firstname}</div>;
    },
  },

  {
    accessorKey: "lastname",
    accessorFn: (row) => {
      const lastname = row?.profile?.lastname || {};
      return lastname;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lastname <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const {firstname, middlename, lastname} = row?.original.profile?
      const lastname = row.original?.profile?.lastname;
      return <div className={` flex items-center`}>{lastname}</div>;
    },
  },

  {
    accessorKey: "middlename",
    accessorFn: (row) => {
      const middlename = row?.profile?.middlename;
      return middlename;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Middlename <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const middlename = row.original?.profile?.middlename ?? "-";

      return <div className={` flex items-center`}>{middlename}</div>;
    },
  },

  {
    accessorKey: "suffix",
    accessorFn: (row) => {
      const suffix = row?.profile?.suffix;
      return suffix;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Suffix <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const suffix = row.original?.profile?.suffix ?? "N/A";

      return <div className={` flex items-center`}>{suffix}</div>;
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
        >Intervention</div>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.original?.updatedAt;
      return <ActionButton data={row.original} />;
    },
  },
];
