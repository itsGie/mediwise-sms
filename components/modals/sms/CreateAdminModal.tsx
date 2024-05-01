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
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { Loader2 } from "../../ui/Loader";

import { useToast } from "../../ui/use-toast";
import { CreateAdminSchema, TCreateAdminSchema } from "@/schema/user";
import { Barangay, Role } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateAdminModal = () => {
  const { toast } = useToast();
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createAdmin";

  const onHandleClose = () => {
    onClose();
  };
  const form = useForm<TCreateAdminSchema>({
    resolver: zodResolver(CreateAdminSchema),
    defaultValues: {
      isVerified: true,
    },
    mode: "all",
  });

  const createAdmin = useMutateProcessor({
    url: "/users/admin",
    key: ["admin"],
    method: "POST",
    options: {
      enabled: !!isModalOpen,
    },
  });

  const barangay = useQueryProcessor<Barangay[]>({
    url: "/barangay",
    key: ["barangay"],
    options: {
      enabled: !!isModalOpen,
    },
  });

  const onSubmit: SubmitHandler<TCreateAdminSchema> = async (values) => {
    console.log("Admin doctor", values);

    createAdmin.mutate(values, {
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Admin created",
          description: `Admin with email of ${values.email} has been created`,
        });
      },
      onError(error, variables, context) {
        console.error(error);
        toast({
          title: "Something went wrong.",
          description: `Admin failed to create`,
        });
      },
    });
  };
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [isModalOpen]);
  const isLoading =
    form.formState.isSubmitting || createAdmin.status == "pending";

  useEffect(() => {
    form.setValue("role", Role.ADMIN);
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="max-h-[90vh] w-[500px] max-w-[90vw] overflow-y-auto dark:bg-[#020817] dark:text-white">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
            Add new admin
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
            Add information about the admin.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-5"
          >
            <div className="flex gap-x-3 items-center">
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-x-3 items-center">
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
                        <SelectTrigger className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500  bg-transparent">
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
                name="barangay"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Barangay
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-0  focus-visible:ring-offset-0  bg-transparent">
                            <SelectValue placeholder="Select a barangay" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                          {barangay?.data?.map((barangay) => (
                            <SelectItem
                              value={barangay?.id || "null"}
                              key={barangay?.id}
                            >
                              {barangay.name}
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

            {/* </div> */}

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
                  return "Create admin";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminModal;
