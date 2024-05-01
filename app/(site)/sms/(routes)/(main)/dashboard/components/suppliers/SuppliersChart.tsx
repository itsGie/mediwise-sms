import { TItemSms } from "@/schema/item-sms";
import { TSupplierSchema } from "@/schema/supplier";
import { Item } from "@prisma/client";
import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SuppliersChartProps = {
  data: (TSupplierSchema & {smsItems: TItemSms & {items: Item[]} []})[]
};

export default function SuppliersChart({ data }: SuppliersChartProps) {
  // 768px

  const newData = data?.map((supplier) => {

    const totalSuppliedItem = supplier?.smsItems?.reduce((total, supplier) => {
      return total + (supplier?.items?.length || 0)
    }, 0);

    return {
      name: supplier?.name,
      items: totalSuppliedItem
    }
  })
  return (
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
        <YAxis />
        <Tooltip contentStyle={{
        color:"black"
      }} />
        <Area
          type="monotone"
          dataKey="items"
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
      </AreaChart>
    </ResponsiveContainer>
  );
}
