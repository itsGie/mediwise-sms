"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";

import Image from "next/image";

// type and validation for excel sheet to json

const ViewPrescriptionModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "viewPrescription";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-[#020817] dark:text-white h-[80%] rounded-md flex flex-col items-center justify-center">
      <h1 className="font-semibold text-xl text-start">Raw Image</h1>
      <div className="overflow-auto max-h-[300px]">
        <img
          src={data?.prescription?.image || ""}
          alt="photo"
          className=" z-50 object-cover rounded-md"
        />
        </div>
        <h1 className="font-semibold text-xl text-start">Converted image</h1>
          <pre className="max-h-[300px] overflow-auto">{data?.prescription?.convertedText}</pre>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPrescriptionModal;
