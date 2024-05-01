"use client";

import {
  Bell,
  Briefcase,
  CalendarDays,
  UserCircle,
  Home,
  MessageCircle,
  TableProperties,
  Users,
  Megaphone,
  History,
  Blocks,
  Paperclip,
} from "lucide-react";
import { MdHive } from "react-icons/md";
import { SidebarItem } from "./SidebarItem";
import { Role } from "@prisma/client";

type routeListType = {
  icon: any;
  label: string;
  href: string;
  roles: ("ALL" | Role)[];
};

const routesList: routeListType[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "",
    roles: ["ADMIN"],
  },

  {
    icon: Home,
    label: "Home",
    href: "/",
    roles: ["DOCTOR"],
  },
  //   {
  //     icon: TableProperties,
  //     label: "Course",
  //     href: "/courses",
  //     roles: ["ADMIN"],
  //   },
  //   {
  //     icon: TableProperties,
  //     label: "Section",
  //     href: "/sections",
  //     roles: ["ADMIN"],
  //   },
  //   {
  //     icon: Users,
  //     label: "Alumni / Students",
  //     href: "/students",
  //     roles: ["ADMIN"],
  //   },
  //   {
  //     icon: Users,
  //     label: "Users",
  //     href: "/users",
  //     roles: ["ADMIN"],
  //   },
  //   {
  //     icon: Briefcase,
  //     label: "Jobs",
  //     href: "/jobs",
  //     roles: ["ALL"],
  //   },
  {
    icon: CalendarDays,
    label: "Schedules",
    href: "/schedules",
    roles: ["DOCTOR", "ADMIN"],
  },
  {
    icon: CalendarDays,
    label: "Events",
    href: "/events",
    roles: ["ADMIN"],
  },

  {
    icon: Paperclip,
    label: "Prescriptions",
    href: "/prescriptions",
    roles: ["ADMIN"],
  },

  {
    icon: CalendarDays,
    label: "Appointments",
    href: "/appointments",
    roles: ["DOCTOR", "ADMIN"],
  },
  {
    icon: History,
    label: "History",
    href: "/history",
    roles: ["DOCTOR"],
  },
  {
    icon: Users,
    label: "Doctors",
    href: "/doctors",
    roles: ["ADMIN"],
  },
  {
    icon: Users,
    label: "Patients",
    href: "/patients",
    roles: ["ADMIN"],
  },
  {
    icon: Blocks,
    label: "Inventory",
    href: "/inventory",
    roles: ["ADMIN"],
  },
  // {
  //   icon: Bell,
  //   label: "Notifications",
  //   href: "/notifications",
  //   roles: ["ALL"],
  // },
  // {
  //   icon: Megaphone,
  //   label: "Anoucement",
  //   href: "/anoucement",
  //   roles: ["ALL"],
  // },
];

type SidebarRoutesProps = {
  role: Role;
};

export const SidebarRoutes = ({ role }: SidebarRoutesProps) => {
  return (
    <div className="flex flex-col w-full ">
      {routesList.map((route) => {
        if (!route.roles.includes(role)) {
          return null;
        }
        return (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={`/mediwise/${role.toLowerCase()}${route.href}`}
          />
        );
      })}
    </div>
  );
};
