"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUpdatePrescriptionSchema, UpdatePrescriptionSchema } from "@/schema/prescriptions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { Button } from "@/components/ui/button";
import { Loader2 } from "@/components/ui/Loader";

// type and validation for excel sheet to json

const UpdatePrescriptionModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "updatePrescription";
  
  const form = useForm<TUpdatePrescriptionSchema>({
    resolver: zodResolver(UpdatePrescriptionSchema),
    defaultValues: {
        
    },
    mode: "all",
  });

  useEffect(() => {

    if(data?.prescription) {
        form.setValue('convertedText', data?.prescription?.convertedText)
    }

    return () => {
        form.reset();
    }
  }, [isModalOpen])

  const updatePrescription = useMutateProcessor<TUpdatePrescriptionSchema, unknown>({
    url: `/prescriptions/${data?.prescription?.id}`,
    method: 'PATCH',
    key: ['prescriptions']
  })

  const onSubmit:SubmitHandler<TUpdatePrescriptionSchema> = (values) => {
    updatePrescription.mutate(values, {
        onError(error, variables, context) {
            console.error(error)
        },
        onSuccess(data, variables, context) {
            console.log(data)
        },
    })
  }

  const isLoading =
  form.formState.isSubmitting || updatePrescription.status === "pending";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-[#020817] dark:text-white h-[80%] rounded-md flex flex-col items-center justify-center">

      <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
          Update prescription
          </DialogTitle>
        </DialogHeader>
        
      <h1 className="font-semibold text-xl text-start">Raw Image</h1>
      <div className="overflow-auto max-h-[400px]">
        <img
          src={data?.prescription?.image || ""}
          alt="photo"
          className=" z-50 object-cover rounded-md"
        />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-5 w-full px-10"
          >
            <div className="w-full mt-5">
                <FormField
                  control={form.control}
                  name="convertedText"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Converted Text
                      </FormLabel>
                      <FormControl>
                        <Textarea
                        cols={8}
                        rows={8}
                          disabled={isLoading}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-transparent w-full"
                          placeholder={`Update Converted Text`}
                          {...field}
                        />
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

                  return "Update prescription";
                })()}
              </Button>
            </DialogFooter>
            
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
};

export default UpdatePrescriptionModal;
