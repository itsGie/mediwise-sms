import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientsTotalType } from "./PatientsTab";

type PatientSummaryProps = {
  data: PatientsTotalType[];
};
const PatientSummary = ({ data }: PatientSummaryProps) => {
  console.log("🚀 ~ PatientSummary ~ data:", data);
  return (
    <Table>
      <TableCaption>A list of patients per month</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Patients</TableHead>
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
    </Table>
  );
};
export default PatientSummary;
