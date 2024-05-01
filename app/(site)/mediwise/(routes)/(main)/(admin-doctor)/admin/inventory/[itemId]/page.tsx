"use client"
import { DataTable } from "@/components/DataTable";
import React, { useEffect, useState } from "react";
import {columns} from './components/Columns'
import { useParams } from "next/navigation";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { BrgyItem, Item } from "@prisma/client";
import { TItemBrgy } from "@/schema/item-brgy";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
const ItemPage = () => {

  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };


  const {onOpen} = useModal()
  const params = useParams()

  const id = params?.itemId

  const brgyItem = useQueryProcessor<TItemBrgy & {items: Item[]}>({
    url: `/brgy-item/${id}`,
    key: ['brgy-item', id]
  })


  useEffect(() => {
    brgyItem.refetch()
  }, [])

  const items = brgyItem?.data?.items?.map(item => item)

  return (
    <div className="p-5 flex flex-col">
      <h1 className="text-3xl font-bold text-[#b85217] mb-10">Manage item</h1>
      <section className="flex flex-col gap-y-3 items-start">
        <span>
          <label htmlFor="" className="font-semibold text-[#b85217]">
            Item Name
          </label>
          <p> {brgyItem.data?.name}</p>
        </span>

        <span>
          <label htmlFor="" className="font-semibold text-[#b85217]">
            Description
          </label>
          <p className="text-sm">
          {brgyItem.data?.description}
          </p>
        </span>

        <span className="flex flex-col">
          <label htmlFor="" className="font-semibold text-[#b85217]">
            Dosage
          </label>
          <p> {brgyItem.data?.dosage}</p>
        </span>
      </section>
      <Button
          className="text-zinc-500 my-5 self-end dark:text-white bg-transparent"
          variant={"outline"}
          onClick={() => onOpen('addNewItemStock', {brgyItem: brgyItem.data})}
        >
          {" "}
          <PackageSearch className="w-5 h-5 mr-2" /> Add new stock
        </Button>

      <DataTable
            // @ts-ignore
            // @ts-nocheck
            columns={columns}
            data={items || []}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
    </div>
  );
};

export default ItemPage;
