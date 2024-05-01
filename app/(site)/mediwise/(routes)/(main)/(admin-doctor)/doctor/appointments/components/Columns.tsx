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
import { Appointment, Profile } from "@prisma/client";
import { TUser } from "@/schema/user";
import { format } from "date-fns";
import ActionButton from "./ActionButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const DATE_FORMAT = `MMM d yyyy hh:mm aaaaa'm`;
export const columns: ColumnDef<Appointment & { doctor: TUser & { profile: Profile }, patient: TUser & { profile: Profile } }>[] = [
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
    accessorKey: "date",
    accessorFn: (row) => {
      const date = row.date;
      return date;
    },
    header: ({ column }) => {
      return (
        <div
          className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const date = row.original.date;
      return (
        <div className=" dark:text-white">
          {format(new Date(date || new Date()), DATE_FORMAT)}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "doctor",
  //   accessorFn: (row) => {
  //     const doctor = (`${row?.doctor?.profile?.firstname as string} ${row?.doctor?.profile?.lastname as string}`);
  //     return doctor;
  //   },
  //   header: ({ column }) => (
  //     <div
  //       className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       doctor <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const doctor = (`${row.original?.doctor?.profile?.firstname as string} ${row.original?.doctor?.profile?.lastname as string}`);

  //     return <div className={` flex items-center`}>{doctor}</div>;
  //   },
  // },

  {
    accessorKey: "title",
    accessorFn: (row) => {
      const title = row.title || {};
      return title;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const {firstname, middlename, lastname} = row.original.profile
      const title = row.original.title;

      return <div className={` flex items-center`}>{title}</div>;
    },
  },

  {
    accessorKey: "illness",
    accessorFn: (row) => {
      const illness = row?.illness || {};
      return illness;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Illness <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const {firstname, middlename, lastname} = row.original.profile
      const illness = row.original?.illness;

      return <div className={` flex items-center`}>{illness}</div>;
    },
  },

  {
    accessorKey: "patient",
    accessorFn: (row) => {
      const patient = (`${row?.patient?.profile?.firstname as string} ${row?.patient?.profile?.lastname as string}`)
      return patient;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Patient <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const studentNo = row.original.profile?.studentNumber as string;
      const patient = (`${row.original?.patient?.profile?.firstname as string} ${row.original?.patient?.profile?.lastname as string}`);

      return <div className={``}>{patient}</div>;
    },
  },
  {
    accessorKey: "status",
    accessorFn: (row) => {
      const status = row.status;
      return status;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      const status = row.original.status as string;

      return (
        <div className={``}>
        <Badge
            className={cn(
              "dark:text-white bg-slate-500",
              status === "PENDING" && "bg-slate-500",
              (status === "REJECTED" || status === "CANCELLED") && "bg-rose-700",
              status === "ACCEPTED" && "bg-[#107736]",
              status === "COMPLETED" && "bg-[#16A34A]"
            )}
          >
            {(() => {
              if (status === "PENDING") {
                return "Appointment Pending";
              }

              if (status === "CANCELLED") {
                return "Appointment Cancelled";
              }


              if (status === "REJECTED") {
                return "Appointment Rejected";
              }

              if (status === "ACCEPTED") {
                return "Appointment Accepted";
              }
              if (status === "COMPLETED") {
                return "Appointment Done";
              }
              return null;
            })()}
          </Badge>
        </div>
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
    accessorFn: (row) => {
      const updated = row.updatedAt;
      return updated;
    },
    header: ({ column }) => {
      return (
        <div
          className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Intervention
        </div>
      );
    },
    cell: ({ row }) => {
      row.original;
      return (
        <ActionButton data={row.original} />
      );
    },
  },

];
