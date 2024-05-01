"use client";
import Avatar from "@/components/Avatar";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { cn } from "@/lib/utils";
import { TAppointment, TUpdateAppointment } from "@/schema/appointment";
import { TBarangay } from "@/schema/barangay";
import { TProfile, TUser, TUserRaw } from "@/schema/user";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import QRCode from "react-qr-code";
import { columns } from "./Columns";
import { AppoinmentStatus, appointment_item } from "@prisma/client";
import { TItemBrgy } from "@/schema/item-brgy";
import moment from "moment-timezone";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";

type AppoinmentsDetailClientProps = {
  currentUser: TUserRaw;
};

const DATE_FORMAT = `MMM d yyyy`;

const AppoinmentsDetailClient: React.FC<AppoinmentsDetailClientProps> = ({
  currentUser,
}) => {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.appointmentId;
  const appointment = useQueryProcessor<
    TAppointment & {
      patient: TUser & {
        profile: TProfile;
      };
      doctor: TUser & {
        profile: TProfile;
      };
      barangay: TBarangay;
      appointment_item: appointment_item & { brgyItem: TItemBrgy }[];
    }
  >({
    url: `/appointments/${appointmentId}`,
    key: ["view-appointment"],
  });

  const updateAppointment = useMutateProcessor<TUpdateAppointment, unknown>({
    url: `/socket/appointments/${appointmentId}`,
    key: ["view-appointment"],
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
  const date = new Date(appointment.data?.date || new Date());

  const newDate = moment.utc(date).tz("Asia/Manila").format();
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 shadow-md p-3 md:p-5 rounded-md ">
      <ArrowLeft
        className="w-7 h-7 cursor-pointer rounded-md text-black dark:text-white"
        onClick={() =>
          // router.push(`/mediwise/${currentUser.role.toLocaleLowerCase()}`)
          router.back()
        }
      />

      <div className="flex justify-center w-full flex-col items-center gap-5">
        <section className="flex flex-col mt-10  w-[80vw] lg:w-[50vw] gap-y-5">
          <h1 className="text-3xl font-semibold text-primary">Appointment detail</h1>
          <div className="flex flex-col mt-10 gap-y-5">
            <div className="flex justify-between text-sm md:text-md">
              <strong>Qr code provided</strong>
              <QRCode
                value={
                  `${
                    process.env.NEXT_PUBLIC_SITE_URL
                  }/mediwise/shared/appointments/${
                    appointment?.data?.id as string
                  }` ?? ""
                }
                className="w-[100px] h-[100px] transition-all"
              />
            </div>

            {appointment.data?.image_path && (
              <div className="flex justify-between text-sm md:text-md">
                <strong>Prescription uploaded</strong>
                <img
                  className="w-[150px] h-[150px] transition-all cursor-pointer"
                  src={appointment.data?.image_path}
                  alt=""
                  onClick={() =>
                    onOpen("viewPhoto", {
                      photoUrl: appointment.data?.image_path as string,
                    })
                  }
                />
              </div>
            )}
            <div className="flex justify-between text-sm md:text-md">
              <strong>Barangay</strong>{" "}
              <span>{appointment.data?.barangay?.name}</span>
            </div>

            <div className="flex justify-between">
              <strong>Date</strong>{" "}
              <span>{format(new Date(newDate), DATE_FORMAT)}</span>
            </div>
            <div className="flex justify-between text-sm md:text-md">
              <strong>Status</strong>{" "}
              <span>
                <Badge
                  className={cn(
                    "",
                    appointment.data?.status === "PENDING" && "bg-zinc-400",
                    appointment.data?.status === "CANCELLED" && "bg-rose-400",
                    appointment.data?.status === "REJECTED" && "bg-rose-500",
                    appointment.data?.status === "ACCEPTED" && "bg-blue-500",
                    appointment.data?.status === "COMPLETED" && "bg-green-500"
                  )}
                >
                  {(() => {
                    if (appointment.data?.status === "PENDING") {
                      return "Appointment Pending";
                    }

                    if (appointment.data?.status === "CANCELLED") {
                      return "Appointment Cancelled";
                    }

                    if (appointment.data?.status === "REJECTED") {
                      return "Appointment Rejected";
                    }

                    if (appointment.data?.status === "ACCEPTED") {
                      return "Appointment Accepted";
                    }
                    if (appointment.data?.status === "COMPLETED") {
                      return "Appointment Done";
                    }
                    return null;
                  })()}
                </Badge>
              </span>
            </div>
            {appointment.data &&
              appointment.data?.appointment_item?.length > 0 && (
                <div className="flex flex-col gap-y-3 text-sm md:text-md">
                  <strong>Medicine Items</strong>{" "}
                  <div className=" overflow-y-auto">
                    <DataTable
                      //@ts-ignore
                      //@ts-nocheck
                      columns={columns}
                      data={appointment.data?.appointment_item || []}
                    />
                  </div>
                </div>
              )}
          </div>
        </section>

        <section className="flex flex-col mt-10 w-[50vw] gap-y-5">
          <h1 className="text-3xl font-semibold text-primary">Patient detail</h1>
          <div className="flex flex-col mt-10 gap-y-5">
            <div className="flex justify-between ">
              <strong>Photo</strong>
              <div className="border rounded-sm p-5">
                <Avatar
                  src={appointment?.data?.patient?.image}
                  className="w-[100px] h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-between ">
              <strong>Name</strong>{" "}
              <span>{appointment.data?.patient?.name || `${appointment.data?.patient?.profile?.firstname} ${appointment.data?.patient?.profile?.lastname}`}</span>
            </div>

            <div className="flex justify-between ">
              <strong>Sickness</strong> <span>{appointment.data?.illness}</span>
            </div>

            <div className="flex justify-between ">
              <strong>Description</strong>{" "}
              <span>{appointment.data?.title}</span>
            </div>

            <div className="flex justify-between">
              <strong>Status</strong>{" "}
              <span>
                <Badge
                  className={cn(
                    "bg-rose-500",
                    appointment.data?.patient.isVerified && "bg-green-500"
                  )}
                >
                  {appointment.data?.patient.isVerified
                    ? "VERIFIED"
                    : "NOT VERIFIED"}
                </Badge>
              </span>
            </div>
          </div>
        </section>

        <section className="flex flex-col mt-10 w-[50vw] gap-y-5">
          <h1 className="text-3xl font-semibold text-primary">Doctor detail</h1>
          <div className="flex flex-col mt-10 gap-y-5">
            <div className="flex justify-between ">
              <strong>Photo</strong>
              <div className="border rounded-sm p-5">
                <Avatar
                  src={appointment?.data?.doctor?.image}
                  className="w-[100px] h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-between ">
              <strong>Name</strong>{" "}
              <span>{appointment.data?.doctor?.name || `${appointment.data?.doctor?.profile?.firstname} ${appointment.data?.doctor?.profile?.lastname}`}</span>
            </div>
            <div className="flex justify-between ">
              <strong>Specialized</strong>{" "}
              <span>{appointment.data?.doctor.profile?.specialist}</span>
            </div>

            <div className="flex justify-between">
              <strong>Status</strong>{" "}
              <span>
                <Badge
                  className={cn(
                    "bg-rose-500",
                    appointment.data?.doctor.isVerified && "bg-green-500"
                  )}
                >
                  {appointment.data?.doctor.isVerified
                    ? "VERIFIED"
                    : "NOT VERIFIED"}
                </Badge>
              </span>
            </div>
          </div>
        </section>
        {appointment.data?.patientId === currentUser.id &&
          appointment.data.status === "ACCEPTED" && (
            <Button
              variant={"destructive"}
              onClick={() => {
                onOpen("deleteModal", {
                  id: appointmentId as string,
                  title: "Cancel appointment",
                  description: "This appointment will be",
                  action: "cancelled",
                  mutatekey: ["view-appointment"],
                  url: `/socket/appointments/${appointmentId}`,
                })
              }}
            >
              Cancel
            </Button>
          )}
      </div>
    </div>
  );
};

export default AppoinmentsDetailClient;
