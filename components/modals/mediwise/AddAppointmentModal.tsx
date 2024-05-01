"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
import { useModal } from "@/hooks/useModalStore";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { Loader2 } from "../../ui/Loader";

import { useToast } from "../../ui/use-toast";
import { CreateDoctorSchema, TCreateDoctorSchema } from "@/schema/user";
import { Profile, Role, User } from "@prisma/client";
import {
  CreateAppointmentSchema,
  TCreateAppointment,
} from "@/schema/appointment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import moment from "moment-timezone";

const AddAppointmentModal = () => {
  const { toast } = useToast();
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "addAppointment";
  const onHandleClose = () => {
    onClose();
    form.reset();
  };
  const form = useForm<TCreateAppointment>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      status: "PENDING",
    },
    mode: "all",
  });
  // const date = new Date(data?.calendarApi?.startStr);
  const date = moment.utc(new Date(data?.calendarApi?.startStr)).tz("Asia/Manila").toDate();
  const availableDoctors = useQueryProcessor<(User & { profile: Profile })[]>({
    url: `/work-schedules/available`,
    key: ["available-doctors", data.calendarApi?.startStr],
    queryParams: {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      barangayId: data.user?.barangayId,
    },
    options: {
      enabled: !!data?.calendarApi && !!data.user && !!isModalOpen,
    },
  });
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [isModalOpen]);
  const onSubmit: SubmitHandler<TCreateAppointment> = async (values) => {
    data.calendarApi?.view?.calendar?.addEvent(values);
    onClose();
  };

  const [isOthers, setIsOthers] = useState(false)

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data.user && data.calendarApi) {
      form.setValue("patientId", data.user.id);
      form.setValue("date", data.calendarApi?.startStr);
      form.setValue("status", "PENDING");
      form.setValue("barangayId", data.user.barangayId as string);
    }
    return () => {
      form.reset();
      setIsOthers(false)
    };
  }, [isModalOpen]);

  useEffect(() => {
    if  (availableDoctors.data && availableDoctors?.data?.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableDoctors.data.length);
      const randomDoctorId = availableDoctors.data[randomIndex].id;
      form.setValue("doctorId", randomDoctorId);
    }
  }, [availableDoctors.status, form, isModalOpen]);


  form.watch(['illness', 'doctorId'])

  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="max-h-[90vh] w-[500px] max-w-[90vw] overflow-y-auto dark:bg-[#020817] dark:text-white">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
            Add new appointment
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
            Add information your appointment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-5"
          >
            <div className="w-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Description
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select a description" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                        <SelectItem value={"Checkup"}>
                          Checkup
                        </SelectItem>
                        <SelectItem value={"Follow up checkup"}>
                          Follow up checkup
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            

              <div className="w-full">
                  <FormField
                    control={form.control}
                    name="illness"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Sickness (optional)
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            
                            if(value === 'Others') {
                              setIsOthers(true)
                              field.onChange("")
                            }
                            else{
                              field.onChange(value)
                              setIsOthers(false)
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0">
                              <SelectValue placeholder="Select sickness" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                            {["Cough", "Diarrhea", "Headaches", "Stomach Aches", "Others", "Rather not to say"].map((illness, key) => {
                              return <SelectItem  value={illness} key={key}>
                                {illness}
                              </SelectItem>
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {
                  isOthers && <div className="w-full">
                  <FormField
                    control={form.control}
                    name="illness"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Specify Sickness (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                            placeholder={`Enter illness`}
                            {...field}
                            
                            
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                }
                


            {(() => {
              if (availableDoctors.status === "pending")
                return (
                  <div className="flex items-center justify-center">
                    <Loader2 size={20} />
                  </div>
                );

              if (availableDoctors.status === "error") return null;

              return (
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Doctors
                        </FormLabel>
                        <Select
                           {...field} // Ensure field props are spread here
                           defaultValue={field.value} // Set default value
                        >
                          <FormControl>
                            <SelectTrigger className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0">
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                            {availableDoctors.data.map((doctor) => (
                              <SelectItem value={doctor.id} key={doctor.id}>
                                {doctor.profile?.firstname}{" "}
                                {doctor.profile?.lastname}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })()}
            <DialogFooter className="py-4">
              <Button
                variant={"default"}
                type="submit"
                className=" dark:text-white"
                disabled={isLoading}
              >
                {(() => {
                  if (isLoading)
                    return (
                      <div className="flex items-center gap-x-3">
                        {" "}
                        Saving <Loader2 size={20} />
                      </div>
                    );

                  return "Add a appointment";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentModal;
