import Avatar from "@/components/Avatar";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { TProfile, TUser } from "@/schema/user";
import { Appointment } from "@prisma/client";
import { Session } from "next-auth";
import React from "react";
import { useModal } from "@/hooks/useModalStore";

type AppointmentItemProps = {
  data: Appointment & {
    doctor: TUser & { profile: TProfile };
    patient: TUser & { profile: TProfile };
  };
  currentUser: Session["user"];
};
const AppointmentItem: React.FC<AppointmentItemProps> = ({
  data,
  currentUser,
}) => {
  const { onOpen } = useModal();

  return (
    <div
      className="relative flex gap-x-3 border-b flex-col cursor-pointer hover:bg-zinc-200 hover:rounded-md p-5"
      onClick={() => {
        if (currentUser?.id === data.patient?.id) {
          onOpen("deleteAppointment", { user: currentUser, appointment: data });
        }
      }}
    >
      {currentUser?.id === data.patient?.id && <DotYellow />}
      <div className="flex items-center gap-x-3">
        <Avatar src={data?.doctor?.image} />
        <span>
          DR. {data.doctor?.profile?.firstname}{" "}
          {data?.doctor?.profile?.lastname}
        </span>
        
      </div>
      <span className="text-center"> {data?.doctor?.profile?.specialist}</span>
      <span className="text-center"> {data?.title}</span>
    </div>
  );
};

export default AppointmentItem;

const DotYellow = () => {
  return (
    <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
  );
};
const MyAppointment = () => {
  return (
    <div className="absolute top-0 left-0 h-full w-1 bg-[rgb(164,243,192)]"></div>
  );
};
