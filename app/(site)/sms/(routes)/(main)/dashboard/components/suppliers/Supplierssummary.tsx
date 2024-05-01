import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientsTotalType } from "./SuppliersTab";
import { useMemo } from "react";
import { TSupplierSchema } from "@/schema/supplier";
import { TItemSms } from "@/schema/item-sms";
import { Item } from "@prisma/client";

type SuppliersSummaryProps = {
  data: (TSupplierSchema & {smsItems: TItemSms & {items: Item[]} []})[]
};

const SuppliersSummary = ({ data }: SuppliersSummaryProps) => {
  const newData = data?.map((supplier) => {

    const totalSuppliedItem = supplier.smsItems.reduce((total, supplier) => {
      return total + (supplier?.items?.length || 0)
    }, 0);

    return {
      name: supplier?.name,
      items: totalSuppliedItem
    }
  })

  const fullTotal = newData.reduce((total, curr) => (total + curr?.items), 0)

  return (
    <Table>
      <TableCaption>A list of supplier</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Supplier</TableHead>
          <TableHead>Supplied Items Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {newData.map((invoice, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{invoice?.name}</TableCell>
            <TableCell className="text-left">
              {invoice?.items}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="dark:text-white">
          <TableCell colSpan={1}>Total</TableCell>
          <TableCell className="text-left">{fullTotal}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
export default SuppliersSummary;
