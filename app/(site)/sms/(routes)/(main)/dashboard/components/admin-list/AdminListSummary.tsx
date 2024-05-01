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
import { TBarangay } from "@/schema/barangay";
import { TUser } from "@/schema/user";
import { useMemo } from "react";

type AdminListProps = {
  data: (TBarangay & {users: TUser[]})[]
};

const AdminList = ({ data }: AdminListProps) => {

  const fullTotal = useMemo(() => {
    return data.reduce((total, curr) => total + curr?.users?.length, 0);
  }, [data]);

  return (
    <Table>
      <TableCaption>Admin count per barangay</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Barangay</TableHead>
          <TableHead>Admin Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((barangay,index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{barangay?.name}</TableCell>
            <TableCell className="text-left">
              {barangay?.users?.length || 0}
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
export default AdminList;
