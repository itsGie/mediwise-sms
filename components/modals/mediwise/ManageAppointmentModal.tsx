"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Webcam from "react-webcam";
import Image from "next/image";
import { Camera, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mutationFn,
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { TUpdateItemTransactionSchemaStatus } from "@/schema/item-transaction";
import { Item, ItemTransactionStatus } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { TItemBrgy } from "@/schema/item-brgy";
// type and validation for excel sheet to json
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePrescriptionSchema,
  TCreatePrescriptionSchema,
} from "@/schema/prescriptions";
import { dataURItoBlob, uploadPhoto } from "@/lib/utils";
import {
  CreateAppointmentPrescriptionSchema,
  TCreateAppointmentPrescriptionSchema,
} from "@/schema/appointment";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
const DATE_FORMAT = `MMM d yyyy`;

const ManageAppointmentModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { toast } = useToast();
  const isModalOpen = isOpen && type === "manageAppointment";
  const items = useQueryProcessor<(TItemBrgy & {items: Item[]} )[]>({
    url: "/brgy-item",
    key: ["inventory-items", "sms"],
    options: {
      enabled: !!isModalOpen && !!data?.appointment?.barangayId,
    },
    queryParams: {
      barangayId: data?.appointment?.barangayId,
    },
  });

  const [isCameraMode, setIsCameraMode] = useState(false);
  const [itemsState, setItemsState] = useState<any>([]);
  useEffect(() => {
    setItemsState(
      items?.data?.filter((item) => item.items?.length > 0)?.map((item) => ({
        itemId: item?.id,
        quantity: 0,
        name: item?.name,
        stock: item?.items.length,
        unit: item?.unit,
        items: item.items
      }))
    );
  }, [items.status, isModalOpen]);

  const form = useForm<TCreateAppointmentPrescriptionSchema>({
    resolver: zodResolver(CreateAppointmentPrescriptionSchema),
    mode: "all",
    defaultValues: {},
  });

  const uploadPrescription = useMutateProcessor<
    TCreateAppointmentPrescriptionSchema,
    unknown
  >({
    url: `/appointments/${data?.appointment?.id}`,
    method: "PUT",
    key: ["appointments", data?.user?.barangayId],
  });

  const onSubmit: SubmitHandler<TCreateAppointmentPrescriptionSchema> = async (
    values
  ) => {
    const file = dataURItoBlob(values.image);

    const { public_id, url } = await uploadPhoto(file as File);

    uploadPrescription.mutate(
      { image: url },
      {
        onSuccess(data, variables, context) {
          onClose();
        },
        onError(error, variables, context) {
          console.error(error);
        },
      }
    );
  };


  const submitItem = useMutation({
    mutationFn: (value) => mutationFn({ url: `/appointments/${data?.appointment?.id}/appointment-items`,method: "POST", value: value 
    })
  })
  const dispatchItem = async () => {
    const items = itemsState.filter((item: any) => item.quantity > 0 && {});
    const image = form.getValues('image')
    if(image) {
      const file = dataURItoBlob(image);
      const { public_id, url } = await uploadPhoto(file as File);

      uploadPrescription.mutate(
        { image: url },
        {
          onSuccess(data, variables, context) {
            onClose();
          },
          onError(error, variables, context) {
            console.error(error);
          },
        }
      );
    }
    submitItem.mutate(items, {
      onSuccess(data, variables, context) {
        onClose();
      },
      onError(error, variables, context) {
        console.error(error);
      },
    });
  };

  const webcamRef = useRef<any>(null);
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const file = dataURItoBlob(imageSrc);
    const { public_id, url } = await uploadPhoto(file as File);

    uploadPrescription.mutate(
      { image: url },
      {
        onSuccess(data, variables, context) {
          onClose();
          setIsCameraMode(false)
        },
        onError(error, variables, context) {
          console.error(error);
        },
      }
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" overflow-auto min-w-fit dark:bg-[#020817] max-h-[90vh] dark:text-white">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
            Manage appointment{" "}
          </DialogTitle>
        </DialogHeader>

        <section className="flex gap-x-5">
          <Form {...form}>
            <form
              className="flex flex-col gap-y-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col">
                <label className="font-semibold">Title</label>
                <span>{data.appointment?.title}</span>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold">Date</label>
                <span>
                  {format(
                    new Date(data?.appointment?.date || new Date()),
                    DATE_FORMAT
                  )}
                </span>
              </div>

              <div className="flex flex-col gap-y-3">
                <label className="font-semibold">Prescription</label>
                <div className="max-h-[250px] max-w-[330px] overflow-y-auto">
                  <img
                    src={data?.appointment?.image_path as string}
                    className=" object-cover"
                    alt=""
                  />
                </div>
                <div className="flex gap-x-3 items-center">
                  <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setIsCameraMode(true)}
                    size={"icon"}
                    variant={"secondary"}
                  >
                    <Camera />
                  </Button>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            id="upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e?.target?.files?.[0]) {
                                const reader = new FileReader();
                                reader.readAsDataURL(e?.target?.files?.[0]);

                                reader.onloadend = () => {
                                  field.onChange(reader.result);
                                };
                              } else {
                                field.onChange("");
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div></div>

              {isCameraMode ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={640}
                    height={480}
                  />
                  <div className="flex gap-x-3 w-full">
                  <Button type="button" className="w-full" variant={'destructive'} onClick={() => setIsCameraMode(false)}>
                    Cancel
                  </Button>
                  <Button type="button" className="w-full" onClick={capture}>
                    Capture
                  </Button>
                  </div>
                  
                </>
              ) : <Button type="submit">Upload</Button>}
              
              
            </form>
          </Form>

          <div className="flex flex-col">
            <section className="flex flex-col w-full">
              <div className="flex w-full border-t border-b">
                <div className="flex-1 font-semibold p-5">Item Name</div>
                <div className="flex-1 font-semibold p-5">Stock</div>
                <div className="flex-1 font-semibold p-5">Action</div>
              </div>

              <div className="h-[300px] overflow-y-auto">
                {itemsState?.map((item: any) => {
                  return (
                    <div className="flex w-full" key={item?.itemId}>
                      <div className="flex-1 p-5">{item?.name}</div>
                      <div className="flex-1 p-5">
                        {item?.items?.length} {item.unit}
                      </div>
                      <div className="flex gap-x-3 flex-1 items-center p-5">
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => {
                            setItemsState((prev: any) => {
                              const data = prev?.find(
                                (itemState: any) =>
                                  itemState.itemId === item.itemId
                              );
                              if (!!data && data.quantity - 1 >= 0) {
                                const updateItem = {
                                  ...data,
                                  quantity: data.quantity - 1,
                                };
                                return prev?.map((itemState: any) =>
                                  item.itemId === itemState.itemId
                                    ? updateItem
                                    : itemState
                                );
                              }
                              return prev;
                            });
                          }}
                        >
                          -
                        </Button>
                        {item.quantity}

                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => {
                            setItemsState((prev: any) => {
                              const data = prev?.find(
                                (itemState: any) =>
                                  itemState.itemId === item.itemId
                              );
                              if (!!data && data.quantity + 1 <= data.items.length) {
                                const updateItem = {
                                  ...data,
                                  quantity: data.quantity + 1,
                                };
                                return prev?.map((itemState: any) =>
                                  item.itemId === itemState.itemId
                                    ? updateItem
                                    : itemState
                                );
                              }
                              return prev;
                            });
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-x-3 mx-auto mt-10">
                <Button className="flex w-fit" onClick={dispatchItem}>
                  Dispatch
                </Button>
              </div>
            </section>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ManageAppointmentModal;
