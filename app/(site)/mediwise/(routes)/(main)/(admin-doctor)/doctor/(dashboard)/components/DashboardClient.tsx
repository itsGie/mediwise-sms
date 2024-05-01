"use client";

import React from "react";
import PatientsTab from "./patients/PatientsTab";
type DashboardClientProps = {
  tab: string;
};

const DashboardClient = ({ tab = "patients" }: DashboardClientProps) => {
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  // const handleSelectedTab = (tab: string) => {
  //   if (searchParams) {
  //     let currentQueries = qs.parse(searchParams.toString());
  //     const newQueries = { ...currentQueries, tab: tab };

  //     const newParams = qs.stringify(newQueries, {
  //       skipEmptyString: true,
  //       skipNull: true,
  //     });
  //     replace(`${pathname}?${newParams}`);
  //   }
  // };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Accomodated patients</h1>
      <div className="flex flex-col mt-5">
        {(() => {
          if (tab === "patients") return <PatientsTab />;
        })()}
      </div>
    </div>
  );
};

export default DashboardClient;
