"use client";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "This field is required",
  }),
  password: z.string().min(1, {
    message: "This field is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema> | FieldValues;

const AuthForm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<formSchemaType> = async (values) => {
    try {
      const response = await signIn("credentials", {
        ...values, type: "sms",
        redirect: false,
      });

      if (response?.error) {
        toast.error("invalid credentials");
      }

      if (response?.ok && !response.error) {
        toast.success("Logged In!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="  flex flex-col w-[90%] md:w-[30%] items-center p-7 rounded-md z-10"
      >
        <ArrowLeft
          className="w-7 h-7 cursor-pointer rounded-md  absolute top-5 left-5 text-white"
          onClick={() => router.push(`/`)}
        />
        <div className="h-[130px] w-[130px] relative">
          <Image
            src={`/images/Clogo.png`}
            className="object-cover"
            alt="logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <h1 className=" text-[2em] font-semibold text-center mx-10 mt-5 text-zinc-300">
          Stock Management System
        </h1>

        <div className="flex flex-col items-center  w-full gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="uppercase text-xs font-bold text-zinc-300">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-zinc-300 border border-zinc-700 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    type="email"
                    placeholder={`Enter email`}
                    {...field}
                  />
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
                      <div className="border rounded-md flex bg-zinc-300">
                        <Input
                          type={showPass ? "text" : "password"}
                          className="bg-zinc-300 border-none focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder={`Enter Password`}
                          {...field}
                          />
                          <Button type="button" className="" variant={'ghost'} size={'icon'} onClick={() => setShowPass((prev) => !prev)} > {!showPass ? <Eye/> : <EyeOff />} </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        </div>
        {/* <div className="w-fit flex self-start mt-5 items-center gap-x-3">
          <Checkbox
            id="showPass"
            className="border-[#FD7E14] data-[state=checked]:bg-[##FD7E14] data-[state=checked]:text-zinc-300 data-[state=checked]:bg-[#FD7E14]"
            checked={showPass === true}
            onCheckedChange={(checked) => {
              setShowPass((prev) => !prev);
            }}
          />
          <label
            htmlFor="showPass"
            className="text-sm cursor-pointer text-zinc-300"
          >
            Show Password
          </label>
        </div> */}
        <button
          disabled={isLoading}
          className="bg-[#FD7E14] p-1.5 w-full rounded-sm text-zinc-300 text-md mt-5 flex justify-center disabled:cursor-not-allowed"
        >
          {(() => {
            if (isLoading) return <Loader2 className="animate-spin " />;

            return "Login";
          })()}
        </button>
      </form>
    </Form>
  );
};

export default AuthForm;
