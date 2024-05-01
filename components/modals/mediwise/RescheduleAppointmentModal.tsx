"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Loader2 } from "@/components/ui/Loader";
import { useModal } from "@/hooks/useModalStore";
import { useMutateProcessor, useQueryProcessor } from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";

import { Checkbox } from "@/components/ui/checkbox";
import { RescheduleAppointmentSchema, TRescheduleAppointmentSchema } from "@/schema/appointment";
import { useToast } from "@/components/ui/use-toast";

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from "lucide-react";
import { WorkSchedule } from "@prisma/client";

const RecheduleAppointmentModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "rescheduleAppointment";

  const onHandleClose = () => {
    onClose();
  };

  const form = useForm<TRescheduleAppointmentSchema>({
    resolver: zodResolver(RescheduleAppointmentSchema),
    defaultValues: {
    },
    mode: "all",
  });

  const availableSchedule = useQueryProcessor<WorkSchedule[]>({
    url: `/work-schedules`,
    key: ["appointments-doctor"],
    queryParams: {
      userId: data?.user?.id
    },
    options: {
      enabled: !!data.user && isModalOpen
    }
  })

  


  const rescheduleAppointment = useMutateProcessor({
    url: `/socket/appointments/${data?.appointment?.id}`,
    method: "PUT",
    key: ["appointments-doctor", data?.appointment?.barangayId]
  })

  useEffect(() => {
    if(data?.appointment?.date) {
        const date = new Date(data?.appointment?.date)
        const m = date.getMonth() + 1;
        const month = m < 10 ? `0${m}` : m;
        const year = new Date(data?.appointment?.date).getFullYear();
        const d = new Date(data?.appointment?.date).getDate()
        const day = d < 10 ? `0${d}` : d;
        const appointmentDate = `${year}-${month}-${day}`
        form.setValue('date', appointmentDate)
    }
  }, [isModalOpen])
  const {toast} = useToast()
  const onSubmit: SubmitHandler<TRescheduleAppointmentSchema> = async (values) => {
    rescheduleAppointment.mutate(values, {
        onError(error, variables, context) {
            toast({
                title: "Error",
                variant: "destructive"
            })
        },
        onSuccess(data, variables, context) {
            onClose()
            toast({
                title: "Appointment has been rescheduled"
            })
        },
    })
  };

  const isLoading = form.formState.isSubmitting;


  const availableDates = availableSchedule.data?.map(schedule => {
    const date = new Date(schedule?.start || new Date())

    return date.toISOString().split("T")[0]
  });
  const [selectedDate, setSelectedDate] = useState(null);
  
  const filterDates = (date:Date) => {
    const day = date.toISOString().split('T')[0];
    return availableDates?.includes(day);
};

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Reschedule Appointment
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Modify your appointment schedule
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
                    name="date"
                    render={({ field }) => (
                      <FormItem className="w-full flex items-center gap-x-5">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Date
                        </FormLabel>
                        <FormControl>
                          {/* <Input
                            type="date"
                            disabled={isLoading}
                            className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                            placeholder={`Enter the year you started the job`}
                            {...field}
                          /> */}
                          <div className="border rounded-md cursor-pointer  px-2 py-1 flex items-center gap-x-5 w-fit z-50">
                          <Calendar className="h-5 w-5" />
                          <DatePicker
                          id="datePicker"
                          className=" focus-visible:ring-0  focus-visible:ring-offset-0 resize-none   outline-none w-full cursor-pointer"
                          {...field}
                          onChange={(e) => {

                            e?.setDate(e.getDate() + 1)
                            field.onChange(e?.toISOString().split("T")[0])
                          }}

                          // @ts-ignore
                          // @ts-nocheck
                            filterDate={filterDates}
                            />
                          </div>

                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    return "Modify schedule";
                  })()}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecheduleAppointmentModal;
