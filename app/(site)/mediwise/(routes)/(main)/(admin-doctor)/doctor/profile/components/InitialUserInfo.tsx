import Avatar from "@/components/Avatar";
import { TBarangay } from "@/schema/barangay";
import { TUser } from "@/schema/user";
import { Profile } from "@prisma/client";
import { MapPin, Waypoints } from "lucide-react";
import React from "react";

type IntialUserInfoProps = {
  data: TUser & {profile:Profile, barangay?: TBarangay};
};
const InitialUserInfo: React.FC<IntialUserInfoProps> = ({ data }) => {
  return (
    <div className="flex-[0.6] flex flex-col w-full gap-y-5 p-5 bg-white dark:bg-[#1F2937] rounded-lg">
      <div className="flex flex-col gap-y-1">
        <Avatar src={data?.image} className="h-[80px] w-[80px] rounded-md" />
        <span className="font-semibold text-md text-black dark:text-white mt-5">
          {data?.profile?.firstname} {data?.profile?.lastname}
        </span>
      </div>

      {/* <div className="flex flex-col gap-y-1">
        <span className="flex text-sm gap-x-1 text-zinc-700 dark:text-zinc-400">
          <Waypoints className="h-4 w-4" /> {data?.department?.name}
        </span>
        <span className="flex text-sm gap-x-1 text-zinc-700 dark:text-zinc-400">
          <MapPin className="h-4 w-4 " /> Philippines, {data?.profile?.city}
        </span>
      </div> */}

      <div className="flex flex-col gap-y-1">
        <p className="text-md text-zinc-700 dark:text-zinc-400">
          Email address
        </p>
        <span className="flex text-sm gap-x-1 text-black font-semibold  dark:text-white">
          {data?.email}
        </span>
      </div>

      <div className="flex flex-col gap-y-1">
        <p className="text-md text-zinc-700 dark:text-zinc-400">Home address</p>
        <span className="flex text-sm gap-x-1 text-black font-semibold dark:text-white">
           Caloocan{" "}
          {data?.profile?.street} {data?.profile?.homeNo}{" "}
          {data?.barangay?.name || ''}{" "}
        </span>
      </div>

      <div className="flex flex-col gap-y-1">
        <p className="text-md text-zinc-700 dark:text-zinc-400">Phone number</p>
        <span className="flex text-sm gap-x-1 text-black font-semibold  dark:text-white">
          {data?.profile?.contactNo}{" "}
        </span>
      </div>
    </div>
  );
};

export default InitialUserInfo;
