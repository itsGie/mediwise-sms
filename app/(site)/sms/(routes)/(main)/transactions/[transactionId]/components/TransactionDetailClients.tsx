"use client";
import { DataTable } from "@/components/DataTable";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { TBarangay } from "@/schema/barangay";
import { TItemSms } from "@/schema/item-sms";
import { TSupplierSchema } from "@/schema/supplier";
import { TUser } from "@/schema/user";
import {
  TItemTransaction,
  TRequestedItem,
  TUpdateItemTransaction,
  TUpdateItemTransactionSchemaStatus,
  UpdateItemTransactionSchema,
} from "@/schema/item-transaction";
import {
  Item,
  ItemTransaction,
  ItemTransactionStatus,
  RequestedItem,
} from "@prisma/client";
import { FileIcon } from "lucide-react";
import { Session } from "next-auth";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { columns } from "./column";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import PDFViewer from 'pdf-viewer-reactjs'
import { Document, Page } from 'react-pdf';
import { useModal } from "@/hooks/useModalStore";
type TransactionDetailClientProps = {
  currentUser: Session["user"];
};
const TransactionDetailClient: React.FC<TransactionDetailClientProps> = ({
  currentUser,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const { onOpen } = useModal()

  const searchParams = useParams();
  const transactionId = searchParams?.transactionId;

  const transaction = useQueryProcessor<
    ItemTransaction & {
      barangay: TBarangay;
      barangayUser: TUser;
      requested_items: (RequestedItem & { item: TItemSms })[];
    }
  >({
    url: `/transactions/${transactionId}`,
    key: ["transactions", transactionId],
  });

  console.log(transaction.data)
  const items = useQueryProcessor<(TItemSms & { items: Item[], supplier: TSupplierSchema })[]>(
    {
      url: "/sms-item",
      key: ["inventory-items", "sms", "transaction"],
      options: {
        enabled: transaction.data?.status === 'PENDING' && !!transaction.data?.barangayId
      },
      queryParams: {
        barangayId: transaction.data?.barangayId
      }
    }
  );

  const updateStatus = useMutateProcessor<TUpdateItemTransaction, unknown>({
    url: `/transactions/${transactionId}`,
    key: ["transactions", transactionId],
    method: "PATCH",
  });

  const [itemsState, setItemsState] = useState<any>([]);
  useEffect(() => {
    setItemsState(
      items?.data?.map((item) => ({
        itemId: item?.id,
        quantity: 0,
        name: item?.name,
        stock: item.items?.length,
        items: item.items,
        unit: item?.unit,
        supplier: item.supplier?.name,
      }))
    );
  }, [items.status]);

  const submitItem = useMutateProcessor({
    url: `/transactions/${transactionId}`,
    key: ["items"],
    method: "PUT",
  });

  const onSubmit = () => {
    const items = itemsState.filter((item: any) => item.quantity > 0 && {});

    submitItem.mutate(items, {
      onSettled(data, error, variables, context) {
        transaction.refetch()
      },
    });
  };

  return (
    <div className="flex flex-col p-5 w-full gap-y-5">
      <h1 className="text-3xl font-semibold my-5">Request Details</h1>
      <div className="flex flex-col w-full">
        <section className="flex flex-col gap-y-5 items-start">
          <span>
            <label htmlFor="" className="font-semibold text-[#FD7E14]">
              Barangay Name
            </label>
            <p> {transaction.data?.barangay?.name}</p>
          </span>

          <span>
            <label htmlFor="" className="font-semibold text-[#FD7E14]">
              Reference
            </label>
            <p> {transaction.data?.reference}</p>
          </span>

          <span>
            <label htmlFor="" className="font-semibold text-[#FD7E14]">
              Remarks / Description
            </label>
            <p>{transaction.data?.description}</p>
          </span>

          <span className="flex flex-col">
            <label htmlFor="" className="font-semibold text-[#FD7E14]">
              Status
            </label>
            <p>{transaction.data?.status}</p>
            {/* <Badge
              className={cn(
                "",
                transaction.data?.status === "PENDING" && "bg-zinc-400",
                transaction.data?.status === "ONGOING" && "bg-blue-400",
                (transaction.data?.status === "REJECTED" ||
                  transaction.data?.status === "CANCELLED") &&
                  "bg-rose-400",
                transaction.data?.status === "COMPLETED" && "bg-primary"
              )}
            >
              {transaction.data?.status}
            </Badge> */}
          </span>

          {/* <span>
            <div className="relative flex items-center p-2 mt-2 rounded-md flex-col">
              <FileIcon className="h-10 w-10 fill-green-200" />
              <a
                target="_blank"
                href={transaction.data?.fileReport as string}
                className="ml-2 text-sm text-green-400 dark:text-green-300 hover:underline"
              >
                View report
              </a>
            </div>
          </span> */}

          <span>
            <iframe className="w-[75vw] h-[50vh] overflow-y-auto" src={`https://docs.google.com/viewer?embedded=true&url=${transaction.data?.fileReport}`} ></iframe>
          </span>

        </section>

        {(() => {
          if (transaction.data?.status === "PENDING")
            return (
              <section className="flex flex-col w-full">
                <div className="flex w-full border-t border-b">
                  <div className="flex-1 font-semibold p-5">Item Name</div>
                  <div className="flex-1 font-semibold p-5">Stock</div>
                  <div className="flex-1 font-semibold p-5">Supplier name</div>
                  <div className="flex-1 font-semibold p-5">Action</div>
                </div>

                <div className="h-[300px] overflow-y-auto">
                  {itemsState?.map((item: any) => {
                    return (
                      <div className="flex w-full" key={item?.itemId}>
                        <div className="flex-1 p-5">{item?.name}</div>
                        <div className="flex-1 p-5">
                          {item?.items?.length} {item?.unit}
                        </div>
                        <div className="flex-1 p-5">{item?.supplier}</div>
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
                                if (!!data && data.quantity + 1 <= data.stock) {
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

                <div className="flex gap-x-3 mx-auto">
                  <Button
                      className="flex w-fit"
                      variant={"destructive"}
                      onClick={() => {
                        onOpen("deleteModal", {
                          id: transactionId as string,
                          title: "Cancel transaction",
                          description: "This transaction will be",
                          action: "cancelled",
                          mutatekey: ["transactions", transactionId as string],
                          url: `/transactions/${transactionId}/cancel`,
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  <Button className="flex w-fit" onClick={onSubmit}>
                    Submit
                  </Button>
                </div>
              </section>
            );

          if (
            transaction.data?.status === "ONGOING" ||
            transaction.data?.status === "COMPLETED"
          ) {
            return (
              <section className="flex flex-col w-full">
                <div className="flex w-full border-t border-b">
                  <div className="flex-1 font-semibold p-5">Item Name</div>
                  <div className="flex-1 font-semibold p-5">Stock</div>
                </div>

                <div className="h-[300px] overflow-y-auto">
                  {transaction.data.requested_items?.map(({ item, quantity }) => {
                    return (
                      <div className="flex w-full" key={item?.id}>
                        <div className="flex-1 p-5">{item?.name}</div>
                        <div className="flex-1 p-5">
                          {quantity} {item?.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {transaction.data?.status === "ONGOING" && (
                  <div className="flex gap-x-3 mx-auto">
                    <Button
                      className="flex w-fit"
                      variant={"destructive"}
                      onClick={() => {
                        onOpen("deleteModal", {
                          id: transactionId as string,
                          title: "Cancel transaction",
                          description: "This transaction will be",
                          action: "cancelled",
                          mutatekey: ["transactions", transactionId as string],
                          url: `/transactions/${transactionId}/cancel`,
                        })

                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex w-fit"
                      onClick={() => {
                        updateStatus.mutate({ status: "COMPLETED" });
                      }}
                    >
                      Mark as completed
                    </Button>
                  </div>
                )}
              </section>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default TransactionDetailClient;
