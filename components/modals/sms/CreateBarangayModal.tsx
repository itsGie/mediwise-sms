"use client";
import React, { useEffect } from "react";
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
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";
import {
  CreateSupplierSchema,
  TCreateSupplierSchema,
  TSupplierSchema,
} from "@/schema/supplier";
import { Loader2 } from "../../ui/Loader";
import { useToast } from "@/components/ui/use-toast";
import {
  CreateBarangaySchema,
  TBarangay,
  TCreateBarangay,
} from "@/schema/barangay";
// @ts-ignore
// @ts-nocheck
import { barangayNames } from "@/prisma/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const CreateBarangayModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createBarangay";

  const onHandleClose = () => {
    form.reset();
    onClose();
  };
  const { toast } = useToast();
  const form = useForm<TCreateBarangay>({
    resolver: zodResolver(CreateBarangaySchema),
    defaultValues: {},
    mode: "all",
  });

  const createBarangay = useMutateProcessor<TCreateBarangay, TBarangay>({
    url: "/barangay",
    method: "POST",
    key: ["barangay"],
  });
  const isLoading =
    form.formState.isSubmitting || createBarangay.status === "pending";
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [isModalOpen]);

  
  barangayNames
  const onSubmit: SubmitHandler<TCreateBarangay> = async (values) => {
    createBarangay.mutate(values, {
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Barangay has been added",
        });
        onHandleClose();
      },
      onError(error, variables, context) {
        console.error(error);
        toast({
          title: "Error",
          description: "Barangay name already exist",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[90vh] w-[500px] max-w-[90vw] dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Add a barangay
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Add information about your new barangay.
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
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Barangay
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(e) => {
                              field.onChange(e)
                              const brgy = barangayNames.find((brgy) => brgy.barangayName == e)
                              form.setValue('zip', Number(brgy?.zip))
                              form.setValue('district', brgy?.district ?? "")
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500  bg-transparent">
                                <SelectValue placeholder="Select a barangay" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                              {barangayNames?.map((barangay) => (
                                <SelectItem
                                  value={barangay?.barangayName || "null"}
                                  key={barangay.barangayName}
                                >
                                  {barangay.barangayName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Zip code
                      </FormLabel>
                      <FormControl>
                        <Input
                        type="number"
                          disabled={isLoading}
                          className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter zip code`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      district
                      </FormLabel>
                      <FormControl>
                        <Input
                        type="text"
                          disabled={isLoading}
                          className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter district`}
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
                  className=" dark:text-white sms-bg sms-bg-hover"
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
                    return "Add barangay";
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

export default CreateBarangayModal;
