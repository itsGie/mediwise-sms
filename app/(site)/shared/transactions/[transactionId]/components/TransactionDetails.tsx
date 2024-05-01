"use client";
import Avatar from "@/components/Avatar";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { cn, extractText } from "@/lib/utils";
import { TAppointment } from "@/schema/appointment";
import { TBarangay } from "@/schema/barangay";
import { TProfile, TUser, TUserRaw } from "@/schema/user";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { columns } from "./Columns";
import {
  ItemTransaction,
  ItemTransactionStatus,
  appointment_item,
} from "@prisma/client";
import { TItemBrgy } from "@/schema/item-brgy";
import moment from "moment-timezone";
import { useModal } from "@/hooks/useModalStore";
import {
  TRequestedItem,
  TUpdateItemTransactionSchemaStatus,
} from "@/schema/item-transaction";
import { TItemSms } from "@/schema/item-sms";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { isGeneratorFunction } from "util/types";

type TransactionDetailsProps = {
  currentUser: TUserRaw;
};

const DATE_FORMAT = `MMM d yyyy`;

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  currentUser,
}) => {
  const params = useParams();
  const router = useRouter();
  const transactionId = params?.transactionId;
  const transaction = useQueryProcessor<
    ItemTransaction & {
      barangay: TBarangay;
      requested_items: (TRequestedItem & { item: TItemSms | TItemBrgy })[];
      barangayUser: TUserRaw & { profile: TProfile };
    }
  >({
    url: `/transactions/${transactionId}`,
    key: ["view-transaction"],
  });

  useEffect(() => {
    transaction.refetch();
  }, []);

  useEffect(() => {
    if (transaction.data?.fileReport) {
      // extractText(transaction.data?.fileReport);
    }
  }, [transaction.data]);

  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const { onOpen } = useModal();

  const { toast } = useToast();

  const date = new Date(transaction.data?.createdAt || new Date());
  const newDate = moment.utc(date).tz("Asia/Manila").format();
  return (
    <div className="flex flex-col bg-white border-primary h-[97vh] overflow-y-auto dark:bg-slate-900 shadow-md p-3 md:p-5 rounded-md">
      <div className="flex justify-center w-full flex-col items-center gap-5">
        <ArrowLeft
          className="w-7 h-7 cursor-pointer self-start rounded-md text-black dark:text-white"
          onClick={() =>
            // router.push(`/mediwise/${currentUser.role.toLocaleLowerCase()}`)
            router.back()
          }
        />
        <section className="flex flex-col mt-10 w-[80vw] lg:w-[50vw]  gap-y-5">
          <h1 className="text-3xl font-semibold">Transaction detail</h1>
          <div className="flex flex-col mt-10 gap-y-5">
            <div className="flex justify-between text-sm md:text-md">
              <strong>Barangay</strong>{" "}
              <span>{transaction.data?.barangay?.name}</span>
            </div>

            <div className="flex justify-between text-sm md:text-md">
              <strong>Date</strong>{" "}
              <span>{format(new Date(newDate), DATE_FORMAT)}</span>
            </div>
            <div className="flex justify-between text-sm md:text-md">
              <strong>Status</strong>{" "}
              <span>
                <Badge
                  className={cn(
                    "",
                    transaction.data?.status === "PENDING" && "bg-zinc-400",
                    transaction.data?.status === "CANCELLED" && "bg-rose-400",
                    transaction.data?.status === "REJECTED" && "bg-rose-500",
                    transaction.data?.status === "ACCEPTED" && "bg-blue-500",
                    transaction.data?.status === "COMPLETED" && "bg-green-500"
                  )}
                >
                  {transaction.data?.status}
                </Badge>
              </span>
            </div>

            <div className="flex justify-between text-sm md:text-md">
              <strong>Requested By</strong>{" "}
              <span>
                {transaction?.data?.barangayUser.profile?.firstname}{" "}
                {transaction?.data?.barangayUser.profile?.lastname}
              </span>
            </div>

            {transaction.data?.fileReport && (
              <div className="flex justify-between text-sm md:text-md">
                <span>
                  <iframe
                    className="w-[75vw] h-[50vh] overflow-y-auto"
                    src={`https://docs.google.com/viewer?embedded=true&url=${transaction.data?.fileReport}`}
                  ></iframe>
                </span>
              </div>
            )}

            {transaction.data &&
              transaction.data?.requested_items?.length > 0 && (
                <div className="flex flex-col gap-y-3">
                  <strong>Medicine Items</strong>{" "}
                  <div className=" overflow-y-auto text-sm md:text-md">
                    <DataTable
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                      //@ts-ignore
                      //@ts-nocheck
                      columns={columns}
                      data={
                        (transaction.data &&
                          transaction.data?.requested_items) ||
                        []
                      }
                    />
                  </div>
                </div>
              )}
            {transaction.data?.barangayUserId === currentUser.id &&
              transaction.data.status === "ONGOING" && (
                <div className="flex justify-center gap-x-3">
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      onOpen("deleteModal", {
                        id: transactionId as string,
                        title: "Cancel transaction",
                        description: "This transaction will be",
                        action: "cancelled",
                        mutatekey: ["view-transaction"],
                        url: `/transactions/${transactionId}/barangay`,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      onOpen("confirmRequest", {
                        transactionRequest: transaction.data,
                      })
                    }
                  >
                    Mark as completed
                  </Button>
                </div>
              )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TransactionDetails;
