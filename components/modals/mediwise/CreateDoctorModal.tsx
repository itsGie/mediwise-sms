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
import { useMutateProcessor, useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Loader2 } from "../../ui/Loader";

import { useToast } from "../../ui/use-toast";
import { CreateDoctorSchema, TCreateDoctorSchema } from "@/schema/user";
import { Role } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TBarangay } from "@/schema/barangay";

const CreateDoctorModal = () => {
  const { toast } = useToast();
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createDoctor";

  const onHandleClose = () => {
    onClose();
  };

  const barangay = useQueryProcessor<TBarangay>({
    url: `/barangay/${data?.user?.barangayId}`,
    key: ['barangay', data?.user?.barangayId]
  })

  const form = useForm<TCreateDoctorSchema>({
    resolver: zodResolver(CreateDoctorSchema),
    defaultValues: {
      isVerified: false,
    },
    mode: "all",
  });

  const createDoctor = useMutateProcessor({
    url: "/users/doctors",
    key: ["doctors", "barangay", data?.user?.barangayId],
    method: "POST",
    options: {
      enabled: !!data?.user?.barangayId,
    },
  });

  useEffect(() => {
    if(barangay.data && data?.user) {
      form.setValue("barangay", data.user?.barangayId as string);
      form.setValue("role", Role.DOCTOR);
      form.setValue('zip', barangay.data.zip ?? '1400')
      form.setValue('city', 'Caloooan')
    }
    return () => {
      form.reset();
    };
  }, [isModalOpen, barangay.data])

  const onSubmit: SubmitHandler<TCreateDoctorSchema> = async (values) => {
    console.log("create doctor", values);

    createDoctor.mutate(values, {
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Doctor created",
          description: `Doctor with email of ${values.email} has been created`,
        });
      },
      onError(error, variables, context) {
        toast({
          title: "Something went wrong.",
          description: `Email already exist`,
          variant: 'destructive'
        });
      },
    });
  };

  console.log(form.formState.errors)
  const isLoading =
    form.formState.isSubmitting || createDoctor.status == "pending";

  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="max-h-[90vh] w-[500px] max-w-[90vw] overflow-y-auto dark:bg-[#020817] dark:text-white">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
            Add new doctor
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
            Add information about the doctor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-5"
          >
            <div className="flex gap-x-3 ">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="firstname"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Firstname
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter firstname`}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            const validatedtext = value.replace(/[0-9]/g, "");
                            field.onChange(validatedtext);
                          }}
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
                  name="lastname"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Lastname
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter Lastname`}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            const validatedtext = value.replace(/[0-9]/g, "");
                            field.onChange(validatedtext);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-x-3 ">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="middlename"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Middlename (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter middlename`}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            const validatedtext = value.replace(/[0-9]/g, "");
                            field.onChange(validatedtext);
                          }}
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
                  name="suffix"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Suffix (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter suffix`}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            const validatedtext = value.replace(/[0-9]/g, "");
                            field.onChange(validatedtext);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="w-full">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500 bg-transparent">
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-x-3 ">
            <div className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                        type="email"
                        placeholder={`Enter email`}
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
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Contact No.
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md pl-3">
                            <span className="text-sm">+63</span>
                          <Input
                            className=" border-none focus-visible:ring-0  focus-visible:ring-offset-0   bg-transparent"
                            // type="number"
                            placeholder={`9123456789`}
                            {...field}
                            onChange={(e) => {

                              if(e.target.value.length > 10 ) {
                                return ;
                              }

                              const validatedtext = e.target.value.replace(/\D/g, "");
                              field.onChange(validatedtext);

                            }}
                          />
                          </div>

                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
            </div>

            {/* <div className="flex gap-x-3 ">
            <div className="w-full">
              <FormField
                control={form.control}
                name="homeNo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Home No.
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                        type="number"
                        placeholder={`Enter Home No.`}
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
                name="street"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Street
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                        placeholder={`Enter Street`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            </div> */}
            

            <div className="flex gap-x-3 ">
            <div className="w-full">
              <FormField
                control={form.control}
                name="specialist"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Specialized
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                        placeholder={`Enter specialized`}
                        {...field}

                        onChange={(e) => {
                          const value = e.target.value;
                          const validatedtext = value.replace(/[0-9]/g, "");
                          field.onChange(validatedtext);
                        }}
                        
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
                name="licenseNo"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      License number
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                        type="number"
                        placeholder={`Enter license no.`}
                        {...field}

                        onChange={(e) => {

                          if(e.target.value.length > 7 ) {
                            return ;
                          }

                          // const validatedtext = e.target.value.replace(/\D/g, "");
                          field.onChange(e.target.value);

                        }}

                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            </div>
            
          
            {/* </div> */}

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
                  return "Create doctor";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDoctorModal;
