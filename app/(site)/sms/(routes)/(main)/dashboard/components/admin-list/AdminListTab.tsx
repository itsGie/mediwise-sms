"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminListTabChart from "./AdminListChart";
import AdminListTabummary from "./AdminListSummary";
import { TUser } from "@/schema/user";
import { TBarangay } from "@/schema/barangay";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";

// Get the current year
const currentYear = new Date().getFullYear();

// Generate an array with a 10-year span starting from the current year
const years = Array.from({ length: 10 }, (_, index) =>
  (currentYear - index).toString()
);

export type AdminListTabTotalType = {
  id: number;
  numberOfRequest: number;
  month: string;
};

type AdminListTabProps = {
  data: (TBarangay & { users: TUser[] })[];
};
const AdminListTab: React.FC<AdminListTabProps> = ({ data }) => {
  const [barangayId, setBarangayId] = useState<null | string>(null);
  const barangays = useQueryProcessor<(TBarangay & { users: TUser[] })[]>({
    url: `/barangay`,
    key: ['barangayss']
  })

  const filterBarangay = barangays.data?.filter((brgy) => barangayId ? brgy.id === barangayId : true) || []
  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 md:col-span-3 flex flex-col gap-5">
        <div className="shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white"></div>
        <div className="h-[550px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <h2 className="text-center font-bold text-xl">GRAPH</h2>

          <Select onValueChange={(value) => setBarangayId(prev => value == "ALL" ? null : value)}>
            <SelectTrigger className="w-[180px] ml-auto">
              <SelectValue placeholder="Select Barangay" />
            </SelectTrigger>
            <SelectContent>
              {
                barangays.data?.map((brgy) => {
                  return  <SelectItem key={brgy.id} value={brgy.id}>{brgy.name}</SelectItem>
                })
              }
            </SelectContent>
          </Select>

          <AdminListTabChart data={filterBarangay} />
        </div>
      </div>
      <div className="col-span-5 md:col-span-2 h-full max-h-[660px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl sticky top-0">SUMMARY</h2>
        <div className="overflow-y-auto h-[90%] mt-2">
          <AdminListTabummary data={data || []} />
        </div>
      </div>
    </div>
  );
};
export default AdminListTab;
