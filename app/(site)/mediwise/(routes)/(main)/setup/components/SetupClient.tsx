"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetupAccountSchema, TSetupAccountSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Barangay } from "@prisma/client";
import { Loader2 } from "@/components/ui/Loader";
import UserMenu from "@/components/UserMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { TGetUserById } from "@/service/user";
import { Eye, EyeOff } from "lucide-react";

type SetupClientProps = {
  currentUser: TGetUserById | null;
};
const SetupClient: React.FC<SetupClientProps> = ({ currentUser }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const barangay = useQueryProcessor<Barangay[]>({
    url: "/barangay",
    key: ["barangay"],
  });

  const setup = useMutateProcessor<TSetupAccountSchema, unknown>({
    url: `/auth/setup`,
    key: ["setup-account"],
    method: "POST",
  });
  const form = useForm<TSetupAccountSchema>({
    mode: "all",
    defaultValues: {
      barangayId: "",
      confirmPassword: "",
      password: "",
    },
    resolver: zodResolver(SetupAccountSchema),
  });

  const onSubmit: SubmitHandler<TSetupAccountSchema> = async (values) => {
    setup.mutate(values, {
      onError(error, variables, context) {
        console.error(error);
        toast({
          title: "Set up failed",
          variant: "destructive",
        });
      },
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Set up successful",
        });
        router.refresh();
      },
    });
  };

  const isLoading = form.formState.isSubmitting || setup.status === "pending";
  return (
    <section className="bg-gray-50 dark:bg-gray-900 overflow-auto h-screen">
      <div className=" fixed top-5 right-5 w-fit">
        <UserMenu currentUser={currentUser} />
      </div>

      <div className="flex flex-col items-center justify-center w-full px-6 py-8 mx-auto md:h-screen lg:py-0">
        <img
          className="w-[150px] h-[70px] mr-2 object-cover"
          src="/images/mediwiseLogo.png"
          alt="logo"
        />
        <div className="w-full flex flex-col gap-y-3 p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md md:max-w-lg dark:bg-gray-800 dark:border-gray-700 sm:p-8 ">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Setup account
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            Set up your barangay location and password
          </p>
          <Form {...form}>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Firstname
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-zinc-500  focus-visible:ring-0  focus-visible:ring-offset-0"
                            disabled={isLoading}
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

                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Lastname
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                            disabled={isLoading}
                            placeholder={`Enter lastname`}
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

                  <FormField
                    control={form.control}
                    name="middlename"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Middlename (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                            disabled={isLoading}
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

                  <FormField
                    control={form.control}
                    name="suffix"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Suffix (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                            disabled={isLoading}
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
                <div>
                  <FormField
                    control={form.control}
                    name="barangayId"
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
                              <SelectTrigger
                                className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                                disabled={isLoading}
                              >
                                <SelectValue placeholder="Select a barangay" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                              {barangay?.data?.map((barangay) => (
                                <SelectItem
                                  value={barangay?.id || "null"}
                                  key={barangay?.id}
                                >
                                  Brgy {barangay.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full  ">
                        <FormLabel className="uppercase text-xs font-bold  text-zinc-500 dark:text-zinc-400">
                          Password
                        </FormLabel>
                        <FormControl>
                      <div className="border rounded-md flex border-zinc-500">
                        <Input
                          type={showPass ? "text" : "password"}
                          className="focus-visible:ring-0  border-zinc-500 focus-visible:ring-offset-0 resize-none bg-transparent border-none"
                          placeholder={`Enter Password`}
                          {...field}
                          />
                          <Button type="button" variant={'ghost'} size={'icon'} onClick={() => setShowPass((prev) => !prev)} > {!showPass ? <Eye/> : <EyeOff />} </Button>
                        </div>
                    </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="w-full border-zinc-500 ">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                      <div className="border rounded-md flex border-zinc-500">
                        <Input
                          type={showPass ? "text" : "password"}
                          className="focus-visible:ring-0  focus-visible:ring-offset-0 resize-none bg-transparent border-none"
                          placeholder={`Enter Password Confirmation`}
                          {...field}
                          />
                          <Button type="button" variant={'ghost'} size={'icon'} onClick={() => setShowPass((prev) => !prev)} > {!showPass ? <Eye/> : <EyeOff />} </Button>
                        </div>
                    </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
{/* 
 <div className="flex gap-x-3 items-center mt-5">
                  <Checkbox
                    id="showPass"
                    checked={showPass === true}
                    onCheckedChange={() => setShowPass((prev) => !prev)}
                  />

                  <label
                    htmlFor="showPass"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show password
                  </label>
                </div> */}
                </div>
              </div>
              <div className="flex flex-col gap-y-3">
                {/* <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Firstname
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent border-zinc-500  focus-visible:ring-0  focus-visible:ring-offset-0"
                          disabled={isLoading}
                          placeholder={`Enter firstname`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Lastname
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                          disabled={isLoading}
                          placeholder={`Enter lastname`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middlename"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Middlename (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                          disabled={isLoading}
                          placeholder={`Enter middlename`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Suffix (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                          disabled={isLoading}
                          placeholder={`Enter suffix`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* <FormField
                  control={form.control}
                  name="barangayId"
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
                            <SelectTrigger
                              className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                              disabled={isLoading}
                            >
                              <SelectValue placeholder="Select a barangay" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                            {barangay?.data?.map((barangay) => (
                              <SelectItem
                                value={barangay?.id || "null"}
                                key={barangay?.id}
                              >
                                Brgy {barangay.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                          type="password"
                          disabled={isLoading}
                          placeholder={`Enter password`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Confirm password
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent border-zinc-500 focus-visible:ring-0  focus-visible:ring-offset-0"
                          type="password"
                          disabled={isLoading}
                          placeholder={`Enter password confirmation`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
              <Button className="self-end" disabled={isLoading}>
                {(() => {
                  if (isLoading) {
                    return (
                      <div className="flex items-center">
                        {" "}
                        <Loader2 size={20} /> Saving{" "}
                      </div>
                    );
                  }
                  return "Finish setup";
                })()}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default SetupClient;
