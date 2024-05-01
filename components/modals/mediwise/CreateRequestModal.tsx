"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
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
import { Button } from "../../ui/button";
import { FileIcon, X, Download } from "lucide-react";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { useToast } from "../../ui/use-toast";
import { Loader2 } from "../../ui/Loader";
import {
  CreateItemTransactionSchema,
  TCreateItemTransaction,
} from "@/schema/item-transaction";
import { Textarea } from "@/components/ui/textarea";
import { uploadPhoto } from "@/lib/utils";

// type and validation for excel sheet to json

const CreateRequestModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "createRequest";

  // converting sheet to json and api request

  const form = useForm<TCreateItemTransaction>({
    resolver: zodResolver(CreateItemTransactionSchema),
    mode: "all",
    defaultValues: {
      barangayUserId: data?.user?.id,
      barangayId: data?.user?.barangayId as string,
    },
  });
  const { toast } = useToast();
  const onHandleClose = () => {
    onClose();
    form.reset();
  };

  useEffect(() => {
    if (data.user) {
      form.setValue("barangayUserId", data?.user?.id as string);
      form.setValue("barangayId", data?.user?.barangayId as string);
    }
    return () => {
      form.reset();
    };
  }, [isModalOpen]);

  const createRequest = useMutateProcessor<TCreateItemTransaction, unknown>({
    url: "/transactions/barangay",
    method: "POST",
    key: ["transactions-barangay"],
  });

  const isLoading =
    form.formState.isSubmitting || createRequest.status == "pending";
  const onSubmit: SubmitHandler<TCreateItemTransaction> = async (values) => {
    const { url, public_id } = await uploadPhoto(values.fileReport);
    console.log(url);
    createRequest.mutate(
      { ...values, fileReport: url },
      {
        onError(error, variables, context) {
          toast({
            title: "Request failed",
            variant: "destructive",
          });
          console.log(error)
        },
        onSuccess(data, variables, context) {
          toast({
            title: "Request has been made",
          });
          onHandleClose();
        },
      }
    );
  };

  console.log(form.formState.errors);
  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-[#020817] dark:text-white">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
            Make a request{" "}
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
            Upload your generated report (pdf) and description
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-21 ">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center mt-5">
                {(() => {
                  const value = form.getValues("fileReport");
                  if (!value) {
                    return (
                      <FormField
                        control={form.control}
                        name="fileReport"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <label
                              htmlFor="upload"
                              className=" hover:bg-zinc-200 w-[60%] transition-all m-auto cursor-pointer py-5 border-zinc-300 border-2 rounded-lg flex flex-col justify-center items-center gap-5 "
                            >
                              <Download className=" text-gray-400 ml-2 h-10 w-10 " />
                              <span className="text-[#42579E] text-sm font-semibold">
                                Choose a file
                              </span>
                              <span className="text-xs text-zinc-500 font-semibold">
                                Pdf
                              </span>
                            </label>
                            <FormControl>
                              <Input
                                className="hidden"
                                id="upload"
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                  if (e?.target?.files?.[0]) {
                                    field.onChange(e?.target?.files?.[0]);
                                  } else {
                                    field.onChange(null);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }

                  return (
                    <div className="relative flex items-center p-2 mt-2 rounded-md flex-col">
                      <FileIcon className="h-10 w-10 fill-green-200" />
                      <a
                        href={"#"}
                        className="ml-2 text-sm text-green-400 dark:text-green-300 hover:underline"
                      >
                        {value?.name}
                      </a>
                      <button
                        onClick={() => {
                          form.setValue("fileReport", null);
                          form.reset();
                        }}
                        className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })()}
              </div>

              <div className="w-full mt-5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Remarks/Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          cols={7}
                          rows={7}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-transparent"
                          placeholder={`Enter remarks/description`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="px-6 py-4">
              <Button
                variant={"default"}
                className=" dark:text-white"
                disabled={isLoading}
              >
                {(() => {
                  if (isLoading)
                    return (
                      <div className="flex items-center gap-x-3">
                        {" "}
                        Uploading <Loader2 size={20} />
                      </div>
                    );

                  return "Upload";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequestModal;
