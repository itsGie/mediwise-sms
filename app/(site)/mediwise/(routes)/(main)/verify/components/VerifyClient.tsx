"use client";
import React, { useEffect } from "react";
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
import { VerifyUserSchema, TVerifyUserSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "@/components/ui/Loader";
import UserMenu from "@/components/UserMenu";
import { TGetUserById } from "@/service/user";

type VerifyClientProps = {
  currentUser: TGetUserById | null;
};
const VerifyClient: React.FC<VerifyClientProps> = ({ currentUser }) => {
  const { toast } = useToast();
  const router = useRouter();
  const refreshCode = useQueryProcessor({
    url: `/auth/verify`,
    queryParams: {
      userId: currentUser?.id,
    },
    key: ["resend-code"],
    options: {
      enabled: false,
    },
  });

  useEffect(() => {
    refreshCode.refetch()
  }, [])

  const verifyCode = useMutateProcessor<TVerifyUserSchema, unknown>({
    url: `/auth/verify`,
    method: "POST",
    key: ["verify-code"],
  });

  const resendCode = () => {
    refreshCode.refetch().then(() => {
      toast({
        title: "Code has been sent to your mail",
      });
    });
  };

  const form = useForm<TVerifyUserSchema>({
    mode: "all",
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(VerifyUserSchema),
  });

  const onSubmit: SubmitHandler<TVerifyUserSchema> = async (values) => {
    verifyCode.mutate(values, {
      onError(error, variables, context) {
        console.error(error);
        toast({
          title: "Verification failed",
          description: "Code is invalid",
        });
      },
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Verification sucess",
          description: "Your account has been succesfully verified",
        });
        router.refresh();
      },
    });
  };

  const isLoading =
    form.formState.isSubmitting || verifyCode.status === "pending";

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className=" fixed top-5 right-5 w-fit">
        <UserMenu currentUser={currentUser} />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <img
          className="w-[150px] h-[70px] mr-2 object-cover"
          src="/images/mediwiseLogo.png"
          alt="logo"
        />
        <div className="w-full flex flex-col gap-y-3 p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8 ">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Verify account
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            We have send a code to your email
          </p>
          <Form {...form}>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Enter the code
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          disabled={isLoading}
                          placeholder={`Enter code`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <input
                  type="email"
                  id="email"
                  placeholder="Code"
                /> */}
              </div>
              <Button
                variant={"link"}
                className="text-zinc-500 w-fit"
                type="button"
                disabled={isLoading}
                onClick={resendCode}
              >
                Send code
              </Button>
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
                  return "Continue";
                })()}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default VerifyClient;
