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
import { useMemo } from "react";

type IllnessSummaryProps = {
  data: ({
		_count: {
			illness: number
		},
		illness: string
	})[];
};

const IllnessSummary = ({ data }: IllnessSummaryProps) => {
  // const fullTotal = useMemo(() => {
  //   return data.reduce((acc, curr) => acc + curr.numberOfRequest, 0);
  // }, [data]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
        </TableRow>
      </TableHeader>
      <TableBody>
        
      </TableBody>
    
    </Table>
  );
};
export default IllnessSummary;
