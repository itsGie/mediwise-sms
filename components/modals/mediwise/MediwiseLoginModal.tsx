"use client";
import React, { useState } from "react";
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
import { Loader, Loader2 } from "../../ui/Loader";
import { useModal } from "@/hooks/useModalStore";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";
import { LoginUserSchema, LoginUserSchemaType } from "@/schema/user";
import { BsFacebook, BsGithub, BsGoogle } from "react-icons/bs";
import { IconType } from "react-icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Checkbox } from "../../ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
const MediwiseLoginModal = () => {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "mediwiseLogin";
  const [loading, setLoading] = useState(false);
  const onHandleClose = () => {
    onClose();
  };
  const form = useForm<LoginUserSchemaType>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  type variant = "LOGIN" | "REGISTER";
  const [variants, setVariants] = useState<variant>("LOGIN");
  const [showPass, setShowPass] = useState(false);
  const register = useMutateProcessor<LoginUserSchemaType, any>({
    url: "/users",
    method: "POST",
    key: ["user", "create"],
  });
  const onSubmit: SubmitHandler<LoginUserSchemaType> = async (values) => {
    setLoading(true);
    try {
      if (variants == "REGISTER") {
        register.mutate(values, {
          onSuccess: async () => {
            toast.success("Register Success!");
          },
        });
      }
      if (variants == "LOGIN") {
        const response = await signIn("credentials", {
          ...values,
          type: "mediwise",
          redirect: false,
        });

        if (response?.error) {
          toast.error("invalid credentials");
        }
        if (response?.ok && !response.error) {
          onClose();
          router.refresh();
          toast.success("Logged In!");
        }
      }
    } catch (error: any) {
      // toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const isLoading =
    form.formState.isSubmitting || loading || register.status === "pending";

  const socialActions = async (action: string) => {
    try {
      const response = await signIn(
        action,
        { redirect: false },
        { role: "PATIENT" }
      );
      console.log("response", response);
      if (response?.error) {
        toast.error("invalid credentials");
      }

      if (response?.ok && !response.error) {
        toast.success("Logged In!");
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const router = useRouter();

  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="max-h-[95vh] w-[500px] max-w-[90vw] overflow-y-auto dark:bg-[#020817] dark:text-white py-10">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white flex flex-col items-center">
            <img
              src={"/images/bhaLogo.png"}
              className="w-[100px] h-[100px] object-cover"
            />
            Sign in to your account
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
            Enter your email and password
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-5"
          >
            <div className="">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0  focus-visible:ring-offset-0 bg-transparent"
                        type="email"
                        disabled={isLoading}
                        placeholder={`Enter email`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="border rounded-md flex">
                        <Input
                          disabled={isLoading}
                          type={showPass ? "text" : "password"}
                          className="focus-visible:ring-0  focus-visible:ring-offset-0 resize-none bg-transparent border-none"
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
            </div>

            <span
              onClick={() => {
                onHandleClose();
                router.push("/mediwise/find-your-account");
              }}
              className="underline ml-2 w-fit cursor-pointer text-sm text-zinc-500"
            >
              Forgot password?
            </span>

            {/* <Link href={} className="text-sm  ml-2 text-zinc-500 underline w-fit"></Link> */}

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

            <DialogFooter className="py-4">
              <Button
                variant={"default"}
                type="submit"
                className=" dark:text-white w-full"
                disabled={isLoading}
              >
                {(() => {
                  if (isLoading)
                    return (
                      <div className="flex items-center gap-x-1">
                        {" "}
                        logging in <Loader2 size={20} />
                      </div>
                    );
                  return "Login";
                })()}
              </Button>
            </DialogFooter>
            <span className="text-sm text-center text-zinc-500">
              Don`t have an account?{" "}
              <span
                onClick={() => {
                  onHandleClose();
                  router.push("/mediwise/register");
                }}
                className="underline cursor-pointer"
              >
                Sign up here
              </span>{" "}
            </span>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolue inset-0 flex items-center ">
              <div className="w-full border-gray-300 border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-[#020817] px-2 text-gray-500 -mt-3">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialActions("github")}
            />
            {/* <AuthSocialButton
              icon={BsFacebook}
              onClick={() => socialActions("auth0")}
            />  */}
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialActions("google")}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediwiseLoginModal;

type AuthSocialButtonProps = {
  icon: IconType;
  onClick: () => void;
};
function AuthSocialButton({ onClick, icon: Icon }: AuthSocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex
    w-full
    justify-center
    rounded-md
    bg-white
    dark:bg-[#020817]
    px-4
    py-2
    text-gray-500
    shadow-sm
    ring-1
    ring-inset
    ring-gray-300
    hover:bg-gray-200
    focus:outline-offset-0
    "
    >
      <Icon />
    </button>
  );
}
