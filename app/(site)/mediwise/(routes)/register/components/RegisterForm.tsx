"use client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModalStore";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { RegisterUserSchema, TRegister } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Barangay } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const { onOpen } = useModal();

  const today = new Date();
  const [maxDate, setMaxDate] = useState(
    new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
      .toISOString()
      .split("T")[0]
  );

  const [age, setAge] = useState<number | null>(null);
  const form = useForm<TRegister>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      city: "Caloocan",
      role: "PATIENT",
    },
    mode: "all",
  });
  const [showPass, setShowPass] = useState(false);
  const [acceptTerm, setAcceptTerm] = useState(false)
  const router = useRouter();
  const register = useMutateProcessor<TRegister, string>({
    url: "/auth/register",
    key: ["register"],
    method: "POST",
  });

  const barangay = useQueryProcessor<Barangay[]>({
    url: "/barangay",
    key: ["barangay"],
  });

  const { toast } = useToast();
  const onSubmit: SubmitHandler<TRegister> = (values) => {
    console.log(values);

    register.mutate(values, {
      onSuccess(data, variables, context) {
        toast({
          title: "Registered successful",
          description: data,
        });

        setTimeout(() => {
          router.push("/mediwise");
        }, 2000);
      },
      onError(error, variables, context) {
        console.error(error);

        toast({
          title: "Registered failed",
          description: "Email already used",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className=" shadow-md w-[90vw] md:w-[70%] lg:w-[55%] max-h-[95%] flex rounded-md overflow-hidden">
      <section className="hidden md:flex flex-[0.7] ">
        <img
          src="/images/BGPNU.jpeg"
          alt=""
          className="w-full h-full object-cover"
        />
      </section>
      <Form {...form}>
        <form
          className="flex flex-col flex-1 px-10 py-5 bg-white dark:bg-slate-800"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="text-3xl font-semibold ">Create a free account</h1>

          <h2 className="font-semibold mt-10">
            {step === 1 ? "Personal Information" : "Account Information"}
          </h2>

          {/* slider */}
          <section className="flex h-full overflow-x-auto mt-10">
            {step === 1 && (
              <div className="flex flex-col gap-y-3 w-full">
                <div className="flex flex-col md:flex-row justify-evenly gap-x-3 gap-y-3">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Firstname
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500  bg-transparent"
                            type="text"
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
                    name="middlename"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Middlename (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500  bg-transparent"
                            type="text"
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

                <div className="flex justify-evenly gap-x-3 flex-col md:flex-row gap-y-3">
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Lastname
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0  focus-visible:ring-offset-0  border-zinc-500  bg-transparent"
                            type="text"
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

                  <FormField
                    control={form.control}
                    name="suffix"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Suffix (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500  bg-transparent"
                            type="text"
                            placeholder={`Enter Suffix`}
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

                <div className="flex justify-evenly gap-x-3 flex-col md:flex-row gap-y-3">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Birthdate {age && `(${age} yrs old)`}
                        </FormLabel>
                        <FormControl>
                          <Input
                            max={maxDate} // Set the maximum date dynamically
                            className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500"
                            type="date"
                            placeholder={`Enter birthdate`}
                            {...field}
                            onChange={(e) => {
                              const enteredDate = e.target.value;
                              const birthDate = new Date(enteredDate);
                              const ageDiff =
                                today.getFullYear() - birthDate.getFullYear();

                              // Check if birthday has occurred this year
                              const hasBirthdayOccurred =
                                today.getMonth() > birthDate.getMonth() ||
                                (today.getMonth() === birthDate.getMonth() &&
                                  today.getDate() >= birthDate.getDate());

                              const calculatedAge = hasBirthdayOccurred
                                ? ageDiff
                                : ageDiff - 1;
                              setAge(calculatedAge);

                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Sex
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500  bg-transparent">
                              <SelectValue placeholder="Select a Sex" />
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
                <div className="flex justify-evenly gap-x-3 flex-col md:flex-row gap-y-3">

                <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Contact No.
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md border-zinc-500 pl-3">
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
                  
                  <FormField
                    control={form.control}
                    name="homeNo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          House Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500  bg-transparent"
                            type="number"
                            placeholder={`Enter house no.`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                 
                </div>

                <div className="flex justify-evenly gap-x-3 flex-col md:flex-row gap-y-3">
                 
                <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Street
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0  focus-visible:ring-offset-0 border-zinc-500  bg-transparent"
                            type="text"
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
                    name="barangay"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Barangay
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(e) => {
                              field.onChange(e)
                              const brgy = barangay.data?.find((brgy) => brgy.id == e)
                              form.setValue('zip', brgy?.zip ?? "")
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

                <div className="flex justify-evenly gap-x-3 flex-col md:flex-row gap-y-3">
                <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          District
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            className="focus-visible:ring-0  focus-visible:ring-offset-0"
                            type="text"
                            placeholder={`Enter District`}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Zip
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0  focus-visible:ring-offset-0"
                            disabled={true}
                            type="number"
                            placeholder={`Enter Zip`}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={true}
                            className="focus-visible:ring-0  focus-visible:ring-offset-0"
                            type="text"
                            placeholder={`Enter City`}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

              </div>

              
            )}

            {step === 2 && (
              <div className="flex flex-col gap-y-6 w-full">
                <div className="flex justify-evenly gap-x-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className=" line-clamp-1 uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0  focus-visible:ring-offset-0"
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
                <div className="flex justify-evenly gap-x-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="border rounded-md flex">
                        <Input
                          type={showPass ? "text" : "password"}
                          className="focus-visible:ring-0  focus-visible:ring-offset-0 resize-none bg-transparent border-none"
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
            
                </div>

                <div className="flex justify-evenly gap-x-3">
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="border rounded-md flex">
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
                </div>

                {/* <div className="flex gap-x-3 items-center">
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

                <div className="flex gap-x-3 items-center">
                  <Checkbox
                    id="termCondition"
                    checked={acceptTerm === true}
                    onCheckedChange={() => setAcceptTerm((prev) => !prev)}
                  />

                  <label
                    className=" cursor-pointer hover:underline text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    onClick={() => onOpen('registerTermsAndCondition')}
                  >
                    Terms & Conditions
                  </label>
                </div>

              </div>
            )}
          </section>

          <div className="flex mt-10 w-full gap-x-5 justify-between">
            {step === 1 && (
              <>
                <Button
                  type="button"
                  className="mr-auto"
                  onClick={() => router.replace("/mediwise")}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  className="ml-auto"
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Button
                  type="button"
                  className="mr-auto"
                  onClick={() => setStep(1)}
                >
                  Prev
                </Button>
                <Button type="submit" disabled={!acceptTerm} className="ml-auto">
                  Submit
                </Button>
              </>
            )}
          </div>

          <span className="text-sm text-center text-zinc-500 dark:text-white">
            Already have an account?
            <span
              onClick={() => {
                router.push("/mediwise");
                onOpen("mediwiseLogin");
              }}
              className="underline cursor-pointer"
            >
              Sign in here
            </span>
          </span>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
