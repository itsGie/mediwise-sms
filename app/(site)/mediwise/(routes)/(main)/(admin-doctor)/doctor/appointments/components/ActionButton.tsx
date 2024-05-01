import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { TUpdateAppointment } from "@/schema/appointment";
import { TUser } from "@/schema/user";
import { AppoinmentStatus, Appointment, Profile } from "@prisma/client";

import { Archive, Check, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type ActionButtonProps = {
  data: Appointment & {
    doctor: TUser & { profile: Profile };
    patient: TUser & { profile: Profile };
  };
};
const ActionButton: React.FC<ActionButtonProps> = ({ data }) => {
  const updateAppointment = useMutateProcessor<TUpdateAppointment, unknown>({
    url: `/socket/appointments/${data.id}`,
    key: ["appointments-doctor", data.barangayId],
    method: "PATCH",
  });

  const updateAppointmentStatus = (status: AppoinmentStatus) => {
    updateAppointment.mutate(
      {
        status,
      },
      {
        onSuccess(data, variables, context) {
          console.log(data);
        },
        onError(error, variables, context) {
          console.error(error);
        },
      }
    );
  };

  const { onOpen } = useModal();

  const router = useRouter();
  return (
    <div className={`h-full w-full cursor-pointer`}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="h-4 w-4 text-zinc-500" />
        </DropdownMenuTrigger>

        {(() => {
          if (data.status === "PENDING")
            return (
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-xs cursor-pointer hover:bg-zinc-400"
                  onClick={() =>
                    router.push(`/mediwise/shared/appointments/${data?.id}`)
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-xs cursor-pointer hover:bg-zinc-400"
                  onClick={() => updateAppointmentStatus("ACCEPTED")}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Accept
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
                  onClick={() => updateAppointmentStatus("REJECTED")}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            );
          if (data.status === "CANCELLED" || data.status === "REJECTED")
            return (
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-xs cursor-pointer hover:bg-zinc-400"
                  onClick={() =>
                    router.push(`/mediwise/shared/appointments/${data?.id}`)
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
              </DropdownMenuContent>
            );
          if (data.status === "ACCEPTED")
            return (
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-xs cursor-pointer hover:bg-zinc-400"
                  onClick={() =>
                    router.push(`/mediwise/shared/appointments/${data?.id}`)
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs cursor-pointer hover:bg-zinc-400 text-green-600 hover:!text-green-600"
                  onClick={() => updateAppointmentStatus("COMPLETED")}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Done Appointment
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs cursor-pointer text-yellow-600 hover:!text-yellow-600 hover:!bg-yellow-100"
                  onClick={() =>
                    onOpen("rescheduleAppointment", { appointment: data, user: data.doctor  })
                  }
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Reschedule
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
                  onClick={() => updateAppointmentStatus("CANCELLED")}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            );
          return (
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-xs cursor-pointer hover:bg-zinc-400"
                onClick={() =>
                  router.push(`/mediwise/shared/appointments/${data?.id}`)
                }
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          );
        })()}
      </DropdownMenu>
    </div>
  );
};
export default ActionButton;
