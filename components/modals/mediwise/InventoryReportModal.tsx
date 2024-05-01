"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";

import { PDFExport } from "@progress/kendo-react-pdf";
import { Button } from "@progress/kendo-react-buttons";
import { cn } from "@/lib/utils";
const InventoryReportModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const isModalOpen = isOpen && type === "inventoryReport";
  const totalStocks = data?.brgyItems?.reduce(
    (sum, item) => sum + (item?.items.length || 0),
    0
  );
  const pdfExportYearComponent = useRef<any>(null);
  const [reportClicked, setReportClcked] = useState(false);

  const handleExportYearlyPdf = (e: any) => {
    if (pdfExportYearComponent.current) {
      setReportClcked(true);
      pdfExportYearComponent.current?.save();
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      setTimeout(() => {
        setReportClcked(false);
      }, 1000);
    }
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    setTimeout(() => {
    }, 1000)
  }, [] )

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          " min-w-[90%] overflow-y-auto min-h-[75vh] bg-white text-black p-0 rounded-md flex flex-col items-center justify-center"
        )}
      >
        <div className="flex flex-col  min-w-[90vw]">
          <PDFExport ref={pdfExportYearComponent} margin="2cm">
            <div className="container mx-auto w-full p-2">
              <div className="flex justify-between items-center">
              <div className="">
                <h1 className="text-4xl font-bold mb-2 text-[#FD7E14]">
                  Barangay Inventory Report
                </h1>
                <p className="text-gray-600">
                  A summary of available items in the inventory as of{" "}
                  {months[new Date().getMonth()]} {new Date().getFullYear()}
                </p>
              </div>
              <img src="/images/bhaLogo.png" className="w-[150px]" alt="" />
              </div>

              <div className="mt-10">
                <p className="text-lg font-semibold">Summary:</p>
                <p>Total stocks: {totalStocks}</p>
              </div>
              <div
              ref={messagesEndRef}
                className={cn(
                  "max-h-[30vh] overflow-auto",
                  reportClicked && "overflow-visible max-h-[100vh]"
                )}
              >
                <table className="min-w-full bg-white dark:text-black shadow-md rounded-lg mt-10  ">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pl-4">ID</th>
                      <th className="py-2">Item Name</th>
                      <th className="py-2">Stock</th>
                      <th className="py-2">Dosage</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {data.brgyItems?.map((item) => (
                      <tr key={item.id} className="border-t border-gray-200 ">
                        <td className="py-2 pl-4">{item.id}</td>
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">
                          {item?.items.length} {item.unit}
                        </td>
                        <td className="py-2">{item.dosage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PDFExport>

          <Button
            className="bg-[#16A34A] text-white border py-3 px-5 self-center w-fit rounded-md"
            onClick={handleExportYearlyPdf}
          >
            Print Report (PDF)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryReportModal;
