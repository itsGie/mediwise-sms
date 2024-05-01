"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import {
  Form,
} from "../../ui/form";

import {
  CreateWorkScheduleSchema,
  CreateWorkScheduleSchemaType,
} from "@/schema/work-schedule";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";

const AddWorkScheduleModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "addWorkSchedule";

  const onHandleClose = () => {
    onClose();
  };

  const { calendarApi, user } = data;

  const form = useForm<CreateWorkScheduleSchemaType>({
    resolver: zodResolver(CreateWorkScheduleSchema),
    defaultValues: {
      id: "",
      title: "Work Schedule",
      start: "",
      end: "",
      allDay: false,
    },
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (calendarApi && user) {
      form.setValue("id", createId());
      form.setValue("start", calendarApi.startStr);
      form.setValue("end", calendarApi.endStr);
      form.setValue("allDay", calendarApi.allDay);
      form.setValue("barangayId", user?.barangayId as string);
    }

    return () => {
      form.reset();
    };
  }, [calendarApi, form]);


  const onSubmit: SubmitHandler<CreateWorkScheduleSchemaType> = async (
    values
  ) => {
    calendarApi?.view?.calendar?.addEvent(values);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl text-center font-bold">
                Add Work Schedule
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-500">
                Are you sure you want to do this?
                <br />
                This will create your work schedule{" "}
              </DialogDescription>

            </DialogHeader>
            <DialogFooter className="bg-gray-100 px-6 py-4 ">
              <div className="flex items-center justify-between w-full">
                <Button className="" type="button" onClick={onHandleClose} variant={"ghost"}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-white"
                  variant={"default"}
                >
                  Confirm
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkScheduleModal;
