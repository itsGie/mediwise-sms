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
import toast from "react-hot-toast";
import {
  CreateSupplierSchema,
  TCreateSupplierSchema,
  TSupplierSchema,
} from "@/schema/supplier";
import { Loader2 } from "../../ui/Loader";
import { useToast } from "@/components/ui/use-toast";
import { CreateCategorySchema, TCategorySchema, TCreateCategorySchema } from "@/schema/category";

const CreateCategoryModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createCategory";

  const onHandleClose = () => {
    form.reset();
    onClose();
  };
  const { toast } = useToast();

  const form = useForm<TCreateCategorySchema>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {},
    mode: "all",
  });
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [isModalOpen]);
  const createCategory = useMutateProcessor<
  TCreateCategorySchema,
    TCategorySchema
  >({ url: "/category", method: "POST", key: ["category"] });

  const isLoading =
    form.formState.isSubmitting || createCategory.status === "pending";

  const onSubmit: SubmitHandler<TCreateCategorySchema> = async (values) => {
    createCategory.mutate(values, {
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Category has been added",
        });
        onHandleClose();
      },
      onError(error, variables, context) {
        console.error(error);
        toast({
          title: "Error",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className=" overflow-hidden dark:bg-[#020817] dark:text-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
              Add a category
            </DialogTitle>

            <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
              Add information about your new category.
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        Category name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                          placeholder={`Enter category name`}
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
                    return "Add category";
                  })()}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCategoryModal;
