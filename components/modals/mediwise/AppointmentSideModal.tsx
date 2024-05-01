import AppointmentItem from "@/app/(site)/mediwise/(routes)/(main)/patient/appointments/components/AppointmentItem";
import { Loader2 } from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { cn } from "@/lib/utils";
import { TProfile, TUser } from "@/schema/user";
import { Appointment, Profile, WorkSchedule } from "@prisma/client";
import React from "react";

const AppointmentSideModal = () => {
  const { isOpen, type, onOpen, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "appointmentSide";

  const workSchedules = useQueryProcessor<
    (WorkSchedule & { doctor: TUser & { profile: Profile } })[]
  >({
    url: `/work-schedules`,
    key: ["work-schedules"],
    queryParams: {
      barangayId: data.user?.barangayId,
    },
  });

  const currentAppointment = useQueryProcessor<
    (Appointment & {
      doctor: TUser & { profile: TProfile };
      patient: TUser & { profile: TProfile };
    })[]
  >({
    url: "/appointments",
    key: ["appointments", data?.user?.id],
    queryParams: {
      date: data?.calendarApi?.startStr,
      barangayId: data?.user?.barangayId,
    },
  });

  const numberOfAppointments = currentAppointment?.data?.length || 0;
  const limit = 25;
  const limitExceeded = numberOfAppointments >= limit;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[500px] max-w-[90vw] overflow-y-auto dark:bg-[#020817] dark:text-white">
        <div className=" flex-[0.2] mt-10 flex flex-col h-[80vh] justify-between">
          <h1 className="text-center text-lg font-semibold">Appointments</h1>
          <h2
            className={cn(
              "text-center text-md font-semibold",
              limitExceeded && "text-rose-500"
            )}
          >
            slot: {numberOfAppointments}/{limit}
          </h2>
          <div className="flex flex-col mt-10 max-h-[550px] h-[550px] overflow-y-auto gap-y-2">
            {(() => {
              if (currentAppointment.status === "pending") {
                return (
                  <div className="flex items-center justify-center">
                    <Loader2 size={30} />
                  </div>
                );
              }
              if (currentAppointment.status === "error") {
                return null;
              }
              if (currentAppointment?.data?.length <= 0) {
                return (
                  <h1 className="text-center font-semibold">
                    No appointments found
                  </h1>
                );
              }
              return currentAppointment.data?.map((appointment) => (
                <AppointmentItem
                  data={appointment}
                  currentUser={data?.user!}
                  key={appointment.id}
                />
              ));
            })()}
          </div>
          <Button
            className={cn("mx-auto")}
            disabled={limitExceeded}
            onClick={() => {
              if (!limitExceeded) {
                onOpen("addAppointment", {
                  calendarApi: data?.calendarApi,
                  user: data?.user,
                });
              }
            }}
          >
            Add a appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentSideModal;
