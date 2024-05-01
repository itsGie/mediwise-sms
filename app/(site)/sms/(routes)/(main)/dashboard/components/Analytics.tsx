import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { TBarangay } from "@/schema/barangay";
import { TUser } from "@/schema/user";
import { Item, ItemTransaction, RequestedItem } from "@prisma/client";
import React, { PureComponent, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

  function Analytics() {

    const barangay = useQueryProcessor<(TBarangay & {ItemTransaction: ItemTransaction & {requested_items: RequestedItem [] & {item: Item[]}[]} [] })[]>({
      url: `/barangay/items`,
      key: ['barangay', 'items'],
    })

    // const monthlyRequestCounts:any = {};

    // // Iterate through the data and update the count for each month
    // const getOnlyTransactionThisYear = data?.map(barangay => barangay.ItemTransaction)?.filter((barangay) => new Date(barangay?.createdAt).getFullYear() == new Date().getFullYear() )
    
    // getOnlyTransactionThisYear?.forEach(item => {
     
    //   const createdAt = new Date(item.createdAt);
    //   const month = createdAt.toLocaleString('en-US', { month: 'short' }); // Get month abbreviation
    
    //   // Initialize count for the month if it doesn't exist
    //   if (!monthlyRequestCounts[month]) {
    //     monthlyRequestCounts[month] = 0;
    //   }
    
    //   // Increment the count for the month
    //   monthlyRequestCounts[month]++;
    // });
    
    // // Create an array with all 12 months, setting count to 0 for the missing ones
    // const newData = Array.from({ length: 12 }, (_, index) => {
    //   const monthName = new Date(new Date().getFullYear(), index, 1).toLocaleString('en-US', { month: 'short' }); // Get month abbreviation
    //   return {
    //     id: index + 1,
    //     numberOfRequest: monthlyRequestCounts[monthName] || 0,
    //     month: monthName,
    //   };
    // });

  // 768px
  const [barangayId, setBarangayId] = useState<null | string>(null);

    const newData = barangay?.data?.filter((brgy) => barangayId ? brgy.id === barangayId : true)?.map((barangay) => {
        const transactionCount = barangay?.ItemTransaction?.length;

        const itemsCount = barangay?.ItemTransaction?.reduce((total, data) => {
            const count = data?.requested_items?.reduce((total, curr) => {
                return total + (curr?.quantity || 0)
            }, 0)

            return total + (count || 0);
        }, 0)

        return {
            transactionCount,
            name: barangay?.name,
            itemsCount
        }
    })

  return (
    <div className="w-[100%] h-[100%] flex flex-col">
        <h1 className="text-lg font-semibold">Number of item dispatched per barangay</h1>

        <Select onValueChange={(value) => setBarangayId(prev => value == "ALL" ? null : value)}>
            <SelectTrigger className="w-[180px] ml-auto">
              <SelectValue placeholder="Select Barangay" />
            </SelectTrigger>
            <SelectContent>
              {
                barangay.data?.map((brgy) => {
                  return  <SelectItem key={brgy.id} value={brgy.id}>{brgy.name}</SelectItem>
                })
              }
            </SelectContent>
          </Select>

    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={newData}
        margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
        }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <Tooltip contentStyle={{
            color:"black"
        }} />
        <Area
          type="monotone"
          dataKey="itemsCount"
          stackId="1"
          stroke="#2b240d"
          fill="#FD7E14"
          />
        {/* <Area
          type="monotone"
          dataKey="pv"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
          />
          <Area
          type="monotone"
          dataKey="amt"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
        /> */}

        <Brush dataKey="name" height={30} stroke="#e4a061" />

      </AreaChart>
    </ResponsiveContainer>
        </div>
  );
}

// import { useState } from 'react';
// import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
// import { Button } from '@/components/ui/button';

// const Analytics = ({ data }: AnalyticsProps) => {
//   const [filteredData, setFilteredData] = useState<any>([]);
//   const [filterType, setFilterType] = useState(null);

//   const handleFilterData = (type:string) => {
//     let filtered = [];

//     switch (type) {
//       case 'day':
//         // Filter data for the current day
//         const startDate = startOfDay(new Date());
//         const endDate = endOfDay(new Date());
//         filtered = data.filter(barangay => {
//           return barangay.ItemTransaction.some(transaction => {
            
//             const transactionDate = new Date(transaction?.createdAt);
//             return transactionDate >= startDate && transactionDate <= endDate;
//           });
//         });
//         break;
//       case 'month':
//         // Filter data for the current month
//         const startDateOfMonth = startOfMonth(new Date());
//         const endDateOfMonth = endOfMonth(new Date());
//         filtered = data.filter(barangay => {
//           return barangay.ItemTransaction.some(transaction => {
//             const transactionDate = new Date(transaction?.createdAt);
//             return transactionDate >= startDateOfMonth && transactionDate <= endDateOfMonth;
//           });
//         });
//         break;
//       case 'week':
//         // Filter data for the current week
//         const startDateOfWeek = startOfWeek(new Date());
//         const endDateOfWeek = endOfWeek(new Date());
//         filtered = data.filter(barangay => {
//           return barangay.ItemTransaction.some(transaction => {
//             const transactionDate = new Date(transaction?.createdAt);
//             return transactionDate >= startDateOfWeek && transactionDate <= endDateOfWeek;
//           });
//         });
//         break;
//       default:
//         // No filtering
//         filtered = data;
//     }

//     const newData = filtered.map((barangay) => {

//       const transactionCount = barangay.ItemTransaction.length;

//       const itemsCount = barangay.ItemTransaction.reduce((total, data) => {
//           const count = data.requested_items.reduce((total, curr) => {
//               return total + (curr?.quantity || 0)
//           }, 0)

//           return total + (count || 0);
//       }, 0)

//       return {
//           transactionCount,
//           name: barangay.name,
//           itemsCount
//       }
//   })

//     setFilteredData(newData);
//   };

//   return (
//     <div className="w-full h-full flex flex-col">
//       <div className="flex justify-end mb-4">
//         <Button onClick={() => handleFilterData('day')} >Day</Button>
//         <Button onClick={() => handleFilterData('month')} >Month</Button>
//         <Button onClick={() => handleFilterData('week')} >Week</Button>
//       </div>
//            <ResponsiveContainer width="100%" height="100%">
//        <AreaChart
//         width={500}
//         height={400}
//         data={filteredData}
//         margin={{
//             top: 10,
//             right: 30,
//             left: 0,
//             bottom: 0,
//         }}
//         >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <Tooltip contentStyle={{
//             color:"black"
//         }} />
//         <Area
//           type="monotone"
//           dataKey="itemsCount"
//           stackId="1"
//           stroke="#2b240d"
//           fill="#FD7E14"
//           />
//         <Brush dataKey="name" height={30} stroke="#8884d8" />

//       </AreaChart>
//     </ResponsiveContainer>
//     </div>
//   );
// };

export default Analytics;
