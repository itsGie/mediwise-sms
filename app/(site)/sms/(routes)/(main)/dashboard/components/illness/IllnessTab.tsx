"use client";

import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IllnessChart from "./IllnessChart";
import Illnesssummary from "./Illnesssummary";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { TBarangay } from "@/schema/barangay";

// Get the current year
const currentYear = new Date().getFullYear();

// Generate an array with a 10-year span starting from the current year

type IllnessTabProps = {
  data: {
    _count: {
      illness: number;
    };
    illness: string;
  }[];
};
const IllnessTab: React.FC<IllnessTabProps> = ({ data }) => {
  const [month, setMonth] = useState<null | number>();
  const [brgyId, setBrgyId] = useState<null | string>(null);

  const barangays = useQueryProcessor<TBarangay[]>({
    url: "/barangay",
    key: ["barangay"],
  });

  const illness = useQueryProcessor<
    {
      _count: {
        illness: number;
      };
      illness: string;
    }[]
  >({
    url: `/appointments/illness`,
    key: ["appointment", "illness", "brgy"],
    queryParams: {
      month: month ?? undefined,
      barangayId: brgyId ?? undefined,
    },
  });

  useEffect(() => {
    illness.refetch();
  }, [brgyId,month]);

  const months = [
    { value: 0, name: 'Jan' },
    { value: 1, name: 'Feb' },
    { value: 2, name: 'Mar' },
    { value: 3, name: 'Apr' },
    { value: 4, name: 'May' },
    { value: 5, name: 'Jun' },
    { value: 6, name: 'Jul' },
    { value: 7, name: 'Aug' },
    { value: 8, name: 'Sep' },
    { value: 9, name: 'Oct' },
    { value: 10, name: 'Nov' },
    { value: 11, name: 'Dec' }
  ];

  const barangayList = barangays?.data?.map((brgy) => {
    return <SelectItem key={brgy.id} value={brgy.id}> {brgy.name} </SelectItem>;
  });

  const monthList = months?.map((month) => {
    return <SelectItem key={month.value} value={month.value + ''}> {month.name} </SelectItem>;
  });


  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="col-span-5 md:col-span-3 flex flex-col gap-5">
        <div className="shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white flex  gap-x-5 justify-end" >
          <Select onValueChange={(value) => setBrgyId(prev => value === "all" ? null : value)
            }>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select barangay" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem key={'all'} value={'all'}> All </SelectItem>
              {
                  barangayList
              }
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setMonth(prev => value === "all" ? null : Number(value))
            }>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem key={'all'} value={'all'}> All </SelectItem>

              {
                  monthList
              }
            </SelectContent>
          </Select>
        </div>
        <div className="h-[550px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <h2 className="text-center font-bold text-xl">GRAPH</h2>
          <IllnessChart data={illness.data || []} />
        </div>
      </div>
      {/* <div className="col-span-5 md:col-span-2 h-full max-h-[660px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white"> */}
      {/* <h2 className="text-center font-bold text-xl sticky top-0">SUMMARY</h2>
        <div className="overflow-y-auto h-[90%] mt-2">
          <Illnessummary data={data || []} />
        </div> */}
      {/* </div> */}
    </div>
  );
};
export default IllnessTab;
