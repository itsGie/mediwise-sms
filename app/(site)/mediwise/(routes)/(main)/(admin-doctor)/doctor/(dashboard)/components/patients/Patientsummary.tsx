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
import { PatientsTotalType } from "./PatientsTab";
import { useMemo } from "react";

type PatientsummaryProps = {
  data: PatientsTotalType[];
};

const Patientsummary = ({ data }: PatientsummaryProps) => {
  const fullTotal = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.numberOfPatients, 0);
  }, [data]);

  return (
    <Table>
      <TableCaption>A list of appointments per month</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Appointments</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.month}</TableCell>
            <TableCell className="text-left">
              {invoice.numberOfPatients}
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
export default Patientsummary;
