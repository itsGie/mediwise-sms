"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { TUpdateItemTransaction, TUpdateItemTransactionSchemaStatus } from "@/schema/item-transaction";
import { ItemTransactionStatus } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const ConfirmRequestModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "confirmRequest";
  const router = useRouter()

  const updateStatus = useMutateProcessor<
  TUpdateItemTransaction,
    unknown
  >({
    url: `/transactions/${data?.transactionRequest?.id}`,
    method: "PATCH",
    key:["view-transaction"],
  });
  const { toast } = useToast();
  const updateRequestStatus = () => {
    updateStatus.mutate(
      {
        status: "COMPLETED",
      },
      {
        onSuccess(data) {
          console.log(data)
        //   toast({
        //     title: `Request has been updated`,
        //   });
          onClose();
          toast({
            title: "Items accepted"
          })
        },
        onError(error, variables, context) {
        //   toast({
        //     title: `Something went wrong`,
        //     variant: "destructive",
        //   });
        toast({
          title: "Something went wrong"
        })
          onClose();
        },
        onSettled: ()=> {
          router.refresh()
        }
      }
    );
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Confirm Request</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Did you receive the requested items??
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              className=""
              disabled={updateStatus.isPending}
              onClick={onCancel}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              disabled={updateStatus.isPending}
              onClick={() => updateRequestStatus()}
              variant={"default"}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmRequestModal;
