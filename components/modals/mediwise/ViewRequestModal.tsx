"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";

import Image from "next/image";
import { FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { TUpdateItemTransactionSchemaStatus } from "@/schema/item-transaction";
import { ItemTransactionStatus } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

// type and validation for excel sheet to json

const ViewRequestModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const { toast } = useToast();
  const isModalOpen = isOpen && type === "viewRequest";

  const updateStatus = useMutateProcessor<
    TUpdateItemTransactionSchemaStatus,
    unknown
  >({
    url: "/transactions/barangay",
    method: "PATCH",
    key: ["transactions-barangay"],
  });
  const updateRequestStatus = (id: string, status: ItemTransactionStatus) => {
    updateStatus.mutate(
      {
        status: "CANCELLED",
        id,
      },
      {
        onSuccess(data) {
          toast({
            title: `Request has been updated`,
          });
          onClose();
        },
        onError(error, variables, context) {
          toast({
            title: `Something went wrong`,
            variant: "destructive",
          });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[500px] max-w-[90vw] overflow-y-auto dark:bg-[#020817] dark:text-white">
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-2xl text-center font-bold m-2 dark:text-white">
            View Request{" "}
          </DialogTitle>
        </DialogHeader>
        <div className="relative flex items-center p-2 mt-2 rounded-md flex-col">
          <FileIcon className="h-10 w-10 fill-green-200" />
          <a
            target="_blank"
            href={data.transactionRequest?.fileReport as string}
            className="ml-2 text-sm text-green-400 dark:text-green-300 hover:underline"
          >
            View report
          </a>
        </div>

        <div>
          <span className="font-semibold">Reference: </span>
          <pre>{data?.transactionRequest?.reference}</pre>
        </div>


        <div>
          <span className="font-semibold">Remarks: </span>
          <pre>{data?.transactionRequest?.description}</pre>
        </div>
        {(() => {
          if (data?.transactionRequest?.status === "PENDING") {
            return (
              <Button
                type="button"
                variant={"destructive"}
                onClick={() =>
                  updateRequestStatus(
                    data?.transactionRequest?.id as string,
                    "CANCELLED"
                  )
                }
              >
                Cancel request
              </Button>
            );
          }

          if (data?.transactionRequest?.status === "ONGOING") {
            return (
              <Button
                type="button"
                onClick={() =>
                  onOpen('confirmRequest', {transactionRequest: data.transactionRequest})
                }
              >
                Mark as completed
              </Button>
            );
          }
        })()}
      </DialogContent>
    </Dialog>
  );
};

export default ViewRequestModal;
