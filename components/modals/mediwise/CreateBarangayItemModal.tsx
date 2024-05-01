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
import { useMutateProcessor, useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Loader2 } from "../../ui/Loader";
import {
  CreateBrgyItemSchema,
  TCreateBrgyItem,
  TItemBrgy,
} from "@/schema/item-brgy";
import { Textarea } from "../../ui/textarea";
import { useToast } from "../../ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TCategorySchema } from "@/schema/category";

const CreateBarangayItemModal = () => {
  const { toast } = useToast();
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "createBarangayItem";

  const onHandleClose = () => {
    onClose();
    form.reset();
  };

   const categories = useQueryProcessor<TCategorySchema[]>({
    url: `/category`,
    key: ['category']
  })
  
  const form = useForm<TCreateBrgyItem>({
    resolver: zodResolver(CreateBrgyItemSchema),
    defaultValues: {
      brgyId: data.user?.barangayId as string,
      name: "",
      description: "",
      unit: "",
    },
  });

  useEffect(() => {
    form.setValue("brgyId", data.user?.barangayId as string);

    return () => {
      form.reset();
    };
  }, [isModalOpen]);

  const createItem = useMutateProcessor<TCreateBrgyItem, TItemBrgy>({
    url: "/brgy-item",
    method: "POST",
    key: ["inventory-items", "barangay"],
  });

  const onSubmit: SubmitHandler<TCreateBrgyItem> = async (values) => {
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
            Add item
          </DialogTitle>

          <DialogDescription className="text-center text-zinc m-2 font-semibold dark:text-white">
            Add information about your item.
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
                      Item Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0"
                        placeholder={`Enter name`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="w-full">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Stock
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent  focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                        type="number"
                        placeholder={`Enter stock`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

            <div className="w-full">
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Dosage
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-transparent  focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                        type="text"
                        placeholder={`Enter dosage`}
                        {...field}
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
                name="unit"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Unit
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-0  focus-visible:ring-offset-0  bg-transparent">
                            <SelectValue placeholder="Select a unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                            <SelectItem
                              value={"pcs"}
                              key={"pcs"}
                            >
                              Pcs
                            </SelectItem>
                            <SelectItem
                              value={"box"}
                              key={"box"}
                            >
                              Box
                            </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        className="bg-transparent focus-visible:ring-0  focus-visible:ring-offset-0 resize-none"
                        placeholder={`Enter description`}
                        {...field}
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
                name="category_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-0  focus-visible:ring-offset-0  bg-transparent">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="focus-visible:ring-0  focus-visible:ring-offset-0">
                          {categories?.data?.map((category) => (
                            <SelectItem
                              value={category?.id || "null"}
                              key={category?.id}
                            >
                              {category.name}
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
            
            <DialogFooter className="py-4">
              <Button
                variant={"default"}
                type="submit"
                className=" dark:text-white"
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

export default CreateBarangayItemModal;
