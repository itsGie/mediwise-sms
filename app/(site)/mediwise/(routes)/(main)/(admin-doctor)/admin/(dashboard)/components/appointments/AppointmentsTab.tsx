"use client";

import { useState } from "react";
import AlumniChart from "./AppointmentsChart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppointmentsChart from "./AppointmentsChart";
import AppointmentSummary from "./AppointmentSummary";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Appointment } from "@prisma/client";
import { Session } from "next-auth";

// Get the current year
const currentYear = new Date().getFullYear();

// Generate an array with a 10-year span starting from the current year
const years = Array.from({ length: 10 }, (_, index) =>
  (currentYear + index).toString()
);

export type AppointmentsTotalType = {
  id: number;
  numberOfAppointments: number;
  month: string;
};

type AppointmentsTabProps = {
  currentUser: Session['user'] 
}
const AppointmentsTab:React.FC<AppointmentsTabProps> = ({currentUser}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const patients = useQueryProcessor<AppointmentsTotalType[]>({
    url: "/dashboard/admin/appointments",
    queryParams: {
      year: year,
      barangayId: currentUser.barangayId
    },
    key: ["appointment-total", year],
    options: {
      enabled: !!currentUser.barangayId
    }
  });
  
  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 md:col-span-3 flex flex-col gap-5">
        <div className="shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
          
          <div className="flex flex-wrap items-center gap-5 md:gap-10 h-full">
            <Select
              onValueChange={(e) => setYear(parseInt(e))}
              defaultValue={year.toString()}
            >
              <SelectTrigger className="w-[300px] h-[50px] bg-transparent">
                <SelectValue placeholder="Select Years" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem value={year} key={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-[550px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <h2 className="text-center font-bold text-xl">GRAPH</h2>
          <AppointmentsChart data={patients.data || []} />
        </div>
      </div>
      <div className="col-span-5 md:col-span-2 h-full max-h-[660px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl sticky top-0">SUMMARY</h2>
        <div className="overflow-y-auto h-[90%] mt-2">
          <AppointmentSummary data={patients.data || []} />
        </div>
      </div>
    </div>
  );
};
export default AppointmentsTab;
