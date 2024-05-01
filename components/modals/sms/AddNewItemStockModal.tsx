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
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { Loader2 } from "../../ui/Loader";
import {
  CreateBrgyItemSchema,
  TCreateBrgyItem,
  TItemBrgy,
} from "@/schema/item-brgy";
import { Textarea } from "../../ui/textarea";
import { useToast } from "../../ui/use-toast";
import { CreateItemSchema, TCreateItemSchema } from "@/schema/item";

const AddNewItemStockModalSms = () => {
  const { toast } = useToast();
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "addNewItemStockSms";

  const onHandleClose = () => {
    onClose();
    form.reset();
  };
  
  
  const form = useForm<TCreateItemSchema>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      product_number: "",
    },
  });

  useEffect(() => {
    form.setValue("smsItemId", data.smsItem?.id as string);
    return () => {
      form.reset();
    };
  }, [isModalOpen, data.smsItem]);

  const createItem = useMutateProcessor<TCreateItemSchema, any>({
    url: `/sms-item/${data?.smsItem?.id}/item`,
    method: "POST",
    key: ['sms-item', data?.smsItem?.id],
  });

  const onSubmit: SubmitHandler<TCreateItemSchema> = async (values) => {

    console.log('valuesssss', values, data.smsItem)

    createItem.mutate(values, {
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Item has been created",
          description: "The item has been successfully created!",
        });
        onClose();
      },
      onError(error, variables, context) {
        console.error(error);
        toast({
          title: "Something went wrong",
          description: "Item did not create.",
          variant: "destructive",
        });
      },
    });
  };

  const isLoading =
    form.formState.isSubmitting || createItem.status === "pending";

  return (
    <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
      <DialogContent className="max-h-[90vh] w-[500px] max-w-[90vw] overflow-y-auto dark:bg-[#020817] dark:text-white">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
            Add new stock
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
            Add information about the stock.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-5"
          >
            <div className="w-full">
              <FormField
                control={form.control}
                name="product_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Product Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                        placeholder={`Enter Product Number`}
                        {...field}
                        type="number"
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
                name="expiration_date"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Expiration Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="date"
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            

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
                  return "Add item";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewItemStockModalSms;
