"use client";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import UserSkeleton from "./UserSkeleton";
import Avatar from "@/components/Avatar";
import { Separator } from "@/components/ui/separator";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowBigLeft, ArrowLeft, Loader2, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import toast from "react-hot-toast";
import { TUser } from "@/schema/user";
import { Profile, Role } from "@prisma/client";
import { TBarangay } from "@/schema/barangay";

const DoctorDetailPageClient = () => {
  // const { paientId } = useParams();
  const params = useParams();

  const doctorId = params?.doctorId as string;
  const doctor = useQueryProcessor<
    TUser & { profile: Profile; barangay: TBarangay }
  >({
    url: `/users/${doctorId}`,
    key: ["doctors", doctorId],
    queryParams: {
      role: Role.DOCTOR,
    },
    options: {
      enabled: !!doctorId,
    },
  });

  console.log(doctor)
  const router = useRouter();

  const { onOpen } = useModal();

  if (doctor.status === "pending") {
    return <UserSkeleton />;
  }

  if (doctor.status === "error") {
    return (
      <h1 className="text-center font-semibold text-zinc-300">
        Error fetching user
      </h1>
    );
  }

  if (doctor?.data?.isArchived) {
    router.back();
    return null;
  }

  return (
    <div className="flex flex-col p-5 gap-10">
      <header>
        <ArrowLeft
          className=" cursor-pointer hover:text-zinc-500 transition-all"
          onClick={() => router.back()}
        />
      </header>

      <main className="flex flex-col">
        <section className="border-[2px] border-zinc-200 rounded-md p-3 flex items-center">
          <Avatar
            className="w-[80px] h-[80px] object-cover rounded-sm"
            src={doctor?.data?.image as string}
          />
          <div className="flex flex-col ml-3">
            <span className="text-black font-semibold dark:text-white">
              {doctor?.data?.profile.firstname} {doctor?.data?.profile.lastname}
            </span>
            <span className="text-zinc-500 text-xs">
              @{doctor?.data?.email}
            </span>
          </div>
        </section>
        <Separator className="my-10 bg-zinc-200 h-2 dark:bg-zinc-600" />

        <div className="w-full">
          <section className="flex flex-col ">
            <h2 className="font-semibold my-5">Doctor information</h2>

            <div className="flex w-full gap-x-3 mt-5">
              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  Firstname
                </label>
                <div>{doctor?.data?.profile.firstname}</div>
              </div>

              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  Middlename
                </label>
                <div>{doctor?.data?.profile.middlename}</div>
              </div>
            </div>

            <div className="flex w-full gap-x-3 mt-5">
              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  lastname
                </label>
                <div>{doctor?.data?.profile.lastname}</div>
              </div>

              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  Email
                </label>
                <div>{doctor?.data?.email}</div>
              </div>
            </div>

            <div className="flex w-full gap-x-3 mt-5">
              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  Specialization
                </label>
                <div>{doctor?.data?.profile.specialist}</div>
              </div>

              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  License No.
                </label>
                <div>{doctor?.data?.profile.licenseNo}</div>
              </div>
            </div>
          </section>

          <Separator className="mt-10 bg-zinc-200 h-1 dark:bg-zinc-600" />

          <section className="flex flex-col ">
            <h2 className="font-semibold my-5">Physical Address</h2>

            <div className="flex w-full gap-x-3 mt-5">
              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  City
                </label>
                <div>{doctor?.data?.profile.city}</div>
              </div>

              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  Home No.
                </label>
                <div>{doctor?.data?.profile.homeNo}</div>
              </div>
            </div>

            <div className="flex w-full gap-x-3 mt-5">
              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  Street
                </label>
                <div>{doctor?.data?.profile.street}</div>
              </div>

              <div className="w-full">
                <label className="uppercase text-xs font-bold text-zinc-500  dark:text-white ">
                  Barangay
                </label>
                <div>{doctor?.data?.barangay?.name}</div>
              </div>
            </div>
          </section>

          {/* <section className="mt-10">
            <Button
              type="submit"
              variant={"default"}
              className="w-fit"
              disabled={formSubmitting}
            >
              {(() => {
                if (formSubmitting) {
                  return (
                    <div className="flex items-center">
                      <span>Saving</span>{" "}
                      <Loader2 className="animate-spin ml-2 w-5 h-5" />
                    </div>
                  );
                }

                return "Save update";
              })()}
            </Button>
          </section> */}

          {/* <Separator className="my-10 bg-zinc-200 h-1 dark:bg-zinc-600" />
          <section className="flex flex-col ">
            <h2 className="font-semibold my-5 text-rose-700">Danger Zone</h2>
            <Button
              type="button"
              variant={"destructive"}
              className="w-fit"
              onClick={() => onOpen("archiveUser", { user: patient?.data? })}
              disabled={formSubmitting}
            >
              Archive user
            </Button>
          </section> */}
        </div>
      </main>
    </div>
  );
};

export default DoctorDetailPageClient;
