"use client";
import { Loader2 } from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { TUpdateUsersSchemaWithPassword, TUser, UpdateUsersSchemaWithPassword } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@prisma/client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type GeneralInfoProps = {
  data: TUser & {profile:Profile};
};

const GeneralInfo: React.FC<GeneralInfoProps> = ({ data }) => {

  const formSchema = z.object({
    firstname: z.string().min(1, { message: "Firstname is required" }),
    lastname: z.string().min(1, { message: "Lastname is required" }),
    middlename: z.string(),
    email: z
      .string()
      .email()
      .min(1, { message: "Personal is required" }),
    city: z.string().min(1, { message: "City is required" }),
    homeNo: z.string().min(1, { message: "Home number is required" }),
    street: z.string().min(1, { message: "Street is required" }),
    contactNo: z.string().min(1, { message: "Phone number is required" }),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  const form = useForm<formSchemaType>({
    defaultValues: {
      firstname: data?.profile?.firstname as string,
      lastname: data?.profile?.lastname as string,
      middlename: data?.profile?.middlename as string,
      email: data?.email as string,
      city: 'Caloocan' as string,
      street: data?.profile?.street as string,
      homeNo: data?.profile?.homeNo as string,
      contactNo: data?.profile?.contactNo as string,
    },
    resolver: zodResolver(formSchema),
    mode: "all",
  });
  
  const updateGeneralInfo = useMutateProcessor<formSchemaType, unknown>(
    {url:`/users/${data?.id}/passwords`,
    method:"PATCH",
    key:["users", data?.id],
    options:{
      enabled: typeof data?.id !== "undefined",
    }}
  );

  const onSubmit: SubmitHandler<formSchemaType> = (values) => {
    updateGeneralInfo.mutate(values, {
      onSuccess(data, variables, context) {
        toast.success("Profile updated");
      },
    });
  };

  const isLoading =
    updateGeneralInfo.status === "pending" || form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form
        className="flex flex-1 flex-col bg-white dark:bg-[#1F2937] p-5 rounded-lg gap-y-10 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl">General Information</h1>

        <div className="flex justify-evenly gap-x-5">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
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
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter lastname`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly gap-x-5">
          <FormField
            control={form.control}
            name="middlename"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Middle Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
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
            name="contactNo"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    
                    placeholder={`Enter phone number`}
                    // type="number"
                    {...field}

                    onChange={(e) => {

                      if(e.target.value.length > 10 ) {
                        return ;
                      }

                      const validatedtext = e.target.value.replace(/\D/g, "");
                      field.onChange(validatedtext);

                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly gap-x-5">
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                 Email
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
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

        <div className="flex justify-evenly gap-x-5">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Street
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter street`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="homeNo"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  Home Number
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter home number`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-evenly gap-x-5">
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start flex-1">
                <FormLabel className="text-sm dark:text-zinc-400 text-black">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    className="bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none dark:bg-[#374151] dark:text-zinc-300"
                    placeholder={`Enter city`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-fit text-white" type="submit" disabled={isLoading}>
          {(() => {
            if (isLoading)
              return (
                <div className="flex items-center gap-x-2">
                  {" "}
                  <Loader2 size={20} /> Saving
                </div>
              );

            return "Save all";
          })()}
        </Button>
      </form>
    </Form>
  );
};

export default GeneralInfo;
