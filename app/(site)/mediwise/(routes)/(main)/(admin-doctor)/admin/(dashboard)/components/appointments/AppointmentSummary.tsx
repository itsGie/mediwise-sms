import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentsTotalType } from "./AppointmentsTab";

type AppointmentSummaryProps = {
  data: AppointmentsTotalType[];
};

const AppointmentSummary = ({ data }: AppointmentSummaryProps) => {
  console.log("🚀 ~ AppointmentSummary ~ data:", data)
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
              {invoice.numberOfAppointments}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AppointmentSummary;
