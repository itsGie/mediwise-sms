"use client"
import { DataTable } from "@/components/DataTable";
import React, { useState } from "react";
import {columns} from './components/Columns'
import { useParams } from "next/navigation";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { BrgyItem, Item } from "@prisma/client";
import { TItemBrgy } from "@/schema/item-brgy";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
import { TItemSms } from "@/schema/item-sms";
const ItemPage = () => {

  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };


  const {onOpen} = useModal()
  const params = useParams()

  const id = params?.itemId

  const smsItem = useQueryProcessor<TItemSms & {items: Item[]}>({
    url: `/sms-item/${id}`,
    key: ['sms-item', id]
  })
  const items = smsItem?.data?.items?.map(item => item)

  return (
    <div className="p-5 flex flex-col">
      <h1 className="text-3xl font-bold text-[#FD7E14] mb-10">Manage item</h1>
      <section className="flex flex-col gap-y-3 items-start">
        <span>
          <label htmlFor="" className="font-semibold text-[#FD7E14]">
            Item Name
          </label>
          <p> {smsItem.data?.name}</p>
        </span>

        <span>
          <label htmlFor="" className="font-semibold text-[#FD7E14]">
            Description
          </label>
          <p className="text-sm">
          {smsItem.data?.description}
          </p>
        </span>

        <span className="flex flex-col">
          <label htmlFor="" className="font-semibold text-[#FD7E14]">
            Dosage
          </label>
          <p> {smsItem.data?.dosage}</p>
        </span>
      </section>
      <Button
          className="text-zinc-500 my-5 self-end dark:text-white bg-transparent"
          variant={"outline"}
          onClick={() => onOpen('addNewItemStockSms', {smsItem: smsItem.data})}
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
