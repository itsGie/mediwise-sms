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
import { Item, appointment_item } from "@prisma/client";
import { TCategorySchema } from "@/schema/category";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const DATE_FORMAT = `MMM d yyyy`;
export const columns: ColumnDef<TItemBrgy & {items: Item[], onhand_items: Item[], category: TCategorySchema, appointmentItems: appointment_item[]}>[] = [
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
      const name = row?.name;
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
      const name = row.original?.name;
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
      const description = row?.description;
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
      const description = row.original?.description;
      return <div className={` flex items-center line-clamp-2`}>{description}</div>;
    },
  },

  {
    accessorKey: "onhand",
    accessorFn: (row) => {
      const stock = row?.onhand_items?.length;
      return stock;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        On hand <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const stock = row.original?.onhand_items?.length;

      return <div className={` flex items-center`}>{stock}</div>;
    },
  },


  {
    accessorKey: "stock",
    accessorFn: (row) => {
      const stock = row.items?.length || 0;
      return stock;
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
      const stock = row.original?.items?.length || 0;

      return <div className={` flex items-center`}>{stock}</div>;
    },
  },

  {
    accessorKey: "category",
    accessorFn: (row) => {
      const category = row?.category?.name;
      return category;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1 line-clamp-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const category = row.original?.category?.name;
      return <div className={` flex items-center`}>{category|| 'N/A'}</div>;
    },
  },


  {
    accessorKey: "outhand",
    accessorFn: (row) => {
      const stock = row?.appointmentItems.reduce((sum, item) => {
        return (item?.quantity || 0) + sum
      }, 0);
      return stock;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Out hand <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const stock = row?.original?.appointmentItems.reduce((sum, item) => {
        return (item?.quantity || 0) + sum
      }, 0);

      return <div className={` flex items-center`}>{stock}</div>;
    },
  },


  {
    accessorKey: "dosage",
    accessorFn: (row) => {
      const dosage = row?.dosage;
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
      const dosage = row.original?.dosage;

      return <div className={` flex items-center`}>{dosage}</div>;
    },
  },

  {
    accessorKey: "unit",
    accessorFn: (row) => {
      const unit = row?.unit;
      return unit;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Unit <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const unit = row.original?.unit;

      return <div className={` flex items-center`}>{unit}</div>;
    },
  },

  {
    accessorKey: "createdAt",
    accessorFn: (row) => {
      const createdAt = row?.createdAt;
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
  {
    accessorKey: "action",
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
      const createdAt = row.original?.createdAt;
      return (
        <ActionButton data={row?.original}/>
      );
    },
  },
];
