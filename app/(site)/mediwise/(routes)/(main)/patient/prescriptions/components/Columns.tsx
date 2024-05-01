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
import { Profile, User } from "@prisma/client";
import { format } from "date-fns";
import { TPrescriptionSchema } from "@/schema/prescriptions";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const DATE_FORMAT = `MMM d yyyy`;

export const columns: ColumnDef<(TPrescriptionSchema & {user: User & { profile: Profile}})>[] = [
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
    accessorKey: "image",
    accessorFn: (row) => {
      const image = row?.image;
      return image;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Image <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      const image = row.original?.image

      return (
        <div className="">
          <img src={image} className="w-[100px] h-[100px] rounded-md object-cover" />
        </div>
      );
    },
  },

  {
    accessorKey: "convertedText",
    accessorFn: (row) => {
      const convertedText = row?.convertedText;
      return convertedText;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Converted Text <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const convertedText = row.original?.convertedText
      return (
        <div className="overflow-hidden line-clamp-2 w-fit"> <pre className="w-fit">{convertedText}</pre> </div>
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
        <div className="">{format(new Date(createdAt || new Date()), DATE_FORMAT)}</div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div
          className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        </div>
      );
    },
    cell: ({ row }) => {
      const original = row.original;
      return (
        // @ts-ignore
        // @ts-nocheck
        <ActionButton data={original} />
      );
    },
  },
];
