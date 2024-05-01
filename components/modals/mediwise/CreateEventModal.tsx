"use client";
import React, { useEffect } from "react";

import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/useModalStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { CreateEventSchema, TCreateEventSchema } from "@/schema/event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "@/components/ui/Loader";
import Image from 'next/image'
import { Download, X } from "lucide-react";
import { dataURItoBlob, uploadPhoto } from "@/lib/utils";
const CreateEventModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createEvent";

  const onHandleClose = () => {
    onClose();
  };

  const { calendarApi } = data;

  const form = useForm<TCreateEventSchema>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      allDay: false,
    },
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (calendarApi) {
      form.setValue("id", createId());
      form.setValue("start", calendarApi.startStr);
      form.setValue("end", calendarApi.endStr);
      form.setValue("allDay", calendarApi.allDay);
    }

    return () => {
      form.reset();
    };
  }, [calendarApi, form]);

  const onSubmit: SubmitHandler<TCreateEventSchema> = async (values) => {
    console.log('values',values);
    if(values.image_url) {
      const { url } = await uploadPhoto(
        dataURItoBlob(values.image_url as string) as File
      );
      
      calendarApi?.view?.calendar?.addEvent({...values, image_url: url});
    }
    else {
      calendarApi?.view?.calendar?.addEvent(values);
    }
    
  };
  form.watch(['image_url'])
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="text-black max-h-[90vh] w-[500px] max-w-[90vw] overflow-y-auto dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Create Event{" "}
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Customize the title, description, time and date of your event.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">

            {(() => {
                const value = form.getValues("image_url");
                if (!value) {
                  return (
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <label
                            htmlFor="upload"
                            className=" hover:bg-zinc-200 w-[60%] transition-all m-auto cursor-pointer py-5 border-zinc-300 border-2 rounded-lg flex flex-col justify-center items-center gap-5 "
                          >
                            <Download className=" text-gray-400 ml-2 h-10 w-10 " />
                            <span className="text-[#42579E] text-sm font-semibold">
                              Choose a file
                            </span>
                            <span className="text-xs text-zinc-500 font-semibold">
                              Photo (png, jpg, etc)
                            </span>
                          </label>
                          <FormControl>
                            <Input
                              className="hidden"
                              id="upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e?.target?.files?.[0]) {
                                  const reader = new FileReader();
                                  reader.readAsDataURL(e?.target?.files?.[0]);

                                  reader.onloadend = () => {
                                    field.onChange(reader.result);
                                  };
                                } else {
                                  field.onChange("");
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                }

                return (
                  <div className="relative h-20 w-20 mx-auto border rounded-full">
                    <Image
                      src={value}
                      fill
                      alt="group chat image upload"
                      className="rounded-full object-cover"
                    />
                    <button
                      className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                      type="button"
                      onClick={() => form.setValue("image_url", null)}
                    >
                      <X
                        className="h-4 w-4"
                        
                      />
                    </button>
                  </div>
                );
              })()}


              <div className="w-full mt-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                          type="type"
                          placeholder={`Enter title`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full mt-5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          cols={7}
                          rows={7}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-transparent"
                          placeholder={`Enter description`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className=" py-4">
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
                          Adding event <Loader2 size={20} />
                        </div>
                      );
                    return "Add event";
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

export default CreateEventModal;
