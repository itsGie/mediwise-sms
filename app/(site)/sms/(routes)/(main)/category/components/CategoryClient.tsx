"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  PackageSearch,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./Columns";
import { Session } from "next-auth";
import { useModal } from "@/hooks/useModalStore";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { TCategorySchema } from "@/schema/category";

type CategoryClientProps = {
  currentUser: Session["user"];
};
const CategoryClient: React.FC<CategoryClientProps> = ({ currentUser }) => {
  const { onOpen } = useModal();

  const category = useQueryProcessor<(TCategorySchema)[]>({
    url: "/category",
    key:  ["category"],
  });

  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  return (
    <div className="flex flex-col p-10">
      <div className="flex justify-end gap-x-5">
        <Button
          className="text-zinc-500 dark:text-white bg-transparent"
          variant={"outline"}
          onClick={() => onOpen("createCategory", { user: currentUser })}
        >
          {" "}
          <PackageSearch className="w-5 h-5 mr-2" /> Add new category
        </Button>
      </div>

      <div className="flex items-center gap-5 my-10">
        <div className="border flex items-center rounded-md px-2 w-full flex-1">
          <Search className="w-5 h-5 font-semibold text-zinc-500 dark:text-white" />
          <Input
            className="inset-0 outline-none border-none active:outline-none hover:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm bg-transparent"
            onChange={onFilter}
            type="text"
            value={globalFilter}
            placeholder="Search for category"
          />
        </div>
        <Button
          variant="outline"
          className="text-zinc-500 dark:text-white bg-transparent"
          onClick={() => {
            // setRole("All");
            // setDepartment("All");
            setGlobalFilter((prev) => "");
          }}
        >
          <Filter className="w-5 h-5 text-zinc-500" /> Clear Filters
        </Button>
      </div>

      {(() => {
        return (
          <DataTable
            columns={columns}
            data={category.data || []}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        );
      })()}
    </div>
  );
};

export default CategoryClient;
