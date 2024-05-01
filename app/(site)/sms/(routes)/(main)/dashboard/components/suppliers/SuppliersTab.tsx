"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SuppliersChart from "./SuppliersChart";
import Supplierssummary from "./Supplierssummary";
import { TSupplierSchema } from "@/schema/supplier";
import { TItemSms } from "@/schema/item-sms";
import { Item } from "@prisma/client";

// Get the current year
const currentYear = new Date().getFullYear();

// Generate an array with a 10-year span starting from the current year
const years = Array.from({ length: 10 }, (_, index) =>
  (currentYear - index).toString()
);

export type PatientsTotalType = {
  id: number;
  numberOfRequest: number;
  month: string;
};

type SuppliersTabProps = {
  data: (TSupplierSchema & {smsItems: TItemSms & {items: Item[]} []})[]
}
const SuppliersTab:React.FC<SuppliersTabProps> = ({data}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 md:col-span-3 flex flex-col gap-5">
        <div className="shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
          
        </div>
        <div className="h-[550px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <h2 className="text-center font-bold text-xl">GRAPH</h2>
          <SuppliersChart data={data} />
        </div>
      </div>
      <div className="col-span-5 md:col-span-2 h-full max-h-[660px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl sticky top-0">SUMMARY</h2>
        <div className="overflow-y-auto h-[90%] mt-2">
          <Supplierssummary data={data || []} />
        </div>
      </div>
    </div>
  );
};
export default SuppliersTab;
