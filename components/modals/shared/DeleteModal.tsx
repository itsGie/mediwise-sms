import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {toast} from 'react-hot-toast'
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";


const DeleteModal = () => {
  const { isOpen, type, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "deleteModal";

  const onCancel = () => {
    onClose();
  };

  const deleteData = useMutateProcessor<String, unknown>({
    url:data?.url as string,
    method: "DELETE",
    key: data?.mutatekey!,
  })

  const onConfirm = async () => {
    try {
        deleteData.mutate(data?.id as string, {
        onSuccess() {
          toast.success(`Sucessfully ${data?.action}`);
          onClose();
        },
        onError() {
          toast.error("Something went wrong...");
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {data?.title}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            {data?.description}{" "}
            <span className="text-rose-500 font-semibold">{data?.action} </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              className=""
              disabled={deleteData.isPending}
              onClick={onCancel}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              disabled={deleteData.isPending}
              onClick={onConfirm}
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

export default DeleteModal;