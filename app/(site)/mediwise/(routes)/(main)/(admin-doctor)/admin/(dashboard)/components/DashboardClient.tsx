"use client";
import React from "react";
import Widget from "./Widget";
import {
  LucideUserSquare2,
  LayoutDashboard,
  GraduationCap,
  Columns,
  Box,
} from "lucide-react";
import AppointmentsTab from "./appointments/AppointmentsTab";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import ItemsTab from "./items/ItemsTab";
import CategoriesTab from "./categories/ItemsTab";
import { Session } from "next-auth";
import PatientsTab from "./patients/PatientsTab";

type DashboardClientProps = {
  tab: string;
  currentUser: Session["user"];
};

const DashboardClient = ({
  tab = "appointments",
  currentUser,
}: DashboardClientProps) => {
  type WidgetsRecord = {
    appointments: number;
    items: number;
    patients: number;
  };

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();

  const widgets = useQueryProcessor<WidgetsRecord>({
    url: "/dashboard/admin/widgets",
    queryParams: {},
    key: ["dashboard-total-record"],
  });

  const handleSelectedTab = (tab: string) => {
    if (searchParams) {
      let currentQueries = qs.parse(searchParams.toString());
      const newQueries = { ...currentQueries, tab: tab };

      const newParams = qs.stringify(newQueries, {
        skipEmptyString: true,
        skipNull: true,
      });
      replace(`${pathname}?${newParams}`);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div onClick={() => handleSelectedTab("appointments")}>
          <Widget
            title="Appointments"
            total={100 || 0}
            icon={LayoutDashboard}
          />
        </div>
        <div onClick={() => handleSelectedTab("items")}>
          <Widget title="Inventory Items" total={100 || 0} icon={Columns} />
        </div>
        {/* <div onClick={() => handleSelectedTab("categories")}>
          <Widget title="Categories" total={100 || 0} icon={Columns} />
        </div> */}

        <div onClick={() => handleSelectedTab("patients")}>
          <Widget title="Patients" total={100 || 0} icon={LucideUserSquare2} />
        </div>
      </div>
      <div className="flex flex-col mt-5">
        {(() => {
          if (tab === "appointments") return <AppointmentsTab currentUser={currentUser}/>;
          if (tab === "items") return <ItemsTab currentUser={currentUser} />;
          // if (tab === "categories") return <CategoriesTab currentUser={currentUser} />;
          else if (tab === "patients") return <PatientsTab currentUser={currentUser} />;
          // if (tab === "patients") return <JobTab />;
        })()}
      </div>
    </div>
  );
};

export default DashboardClient;
