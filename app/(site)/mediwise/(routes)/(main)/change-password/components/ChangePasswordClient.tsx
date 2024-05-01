"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
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
import {
  ChangePassword,
  TChangePasswordSchema,
} from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";

import { Loader, Loader2 } from "@/components/ui/Loader";
import UserMenu from "@/components/UserMenu";
import { Eye, EyeOff } from "lucide-react";

type SetupClientProps = {};
const SetupClient: React.FC<SetupClientProps> = ({}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const setup = useMutateProcessor<TChangePasswordSchema, unknown>({
    url: `/auth/change-password`,
    key: ["setup-account", "change-password"],
    method: "POST",
  });
  const searchParams = useSearchParams()
  
  const userId = searchParams?.get('userId') || ""
  const code = searchParams?.get('code') || ""

  const form = useForm<TChangePasswordSchema>({
    mode: "all",
    defaultValues: {
      confirmPassword: "",
      password: "",
      userId,
      code
    },
    resolver: zodResolver(ChangePassword),
  });



  const isVerified = useQueryProcessor<unknown>({
    url: `/auth/send-email`,
    key: ['send-email', 'auth',],
    queryParams: {
      userId,
      code
    }
  })

  const onSubmit: SubmitHandler<TChangePasswordSchema> = async (values) => {
    setup.mutate(values, {
      onError(error, variables, context) {
        console.error(error);
        toast({
          title: "Change password failed",
          variant: "destructive",
        });
      },
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Password updated",
        });
        router.replace('/mediwise');
      },
    });
  };

  const isLoading = form.formState.isSubmitting || setup.status === "pending" ;

  if(isVerified.status === 'pending') {
    return <Loader size={30} />
  }

  if(!isVerified.data) {
    return redirect('/mediwise')
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 overflow-auto h-screen">
      <div className=" fixed top-5 right-5 w-fit">
        <UserMenu />
      </div>

      <div className="flex flex-col items-center justify-center w-full px-6 py-8 mx-auto md:h-screen lg:py-0">
        <img
          className="w-[150px] h-[70px] mr-2 object-cover"
          src="/images/mediwiseLogo.png"
          alt="logo"
        />
        <div className="w-full flex flex-col gap-y-3 p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md md:max-w-lg dark:bg-gray-800 dark:border-gray-700 sm:p-8 ">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Change password
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            Set up your password
          </p>
          <Form {...form}>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-5">
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
                            <Button
                              type="button"
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() => setShowPass((prev) => !prev)}
                            >
                              {" "}
                              {!showPass ? <Eye /> : <EyeOff />}{" "}
                            </Button>
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
                            <Button
                              type="button"
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() => setShowPass((prev) => !prev)}
                            >
                              {" "}
                              {!showPass ? <Eye /> : <EyeOff />}{" "}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
 
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
