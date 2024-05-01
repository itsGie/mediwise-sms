import { TBarangay } from "@/schema/barangay";
import { TUser } from "@/schema/user";
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

type AdminListProps = {
  data: (TBarangay & {users: TUser[]})[]
};

export default function AdminList({ data }: AdminListProps) {
  // 768px

  
  const newData = data.map((barangay) => {

    const adminCount = barangay?.users?.reduce((total, user) => {
      return user.role == "ADMIN" ? total + 1 : total
    }, 0)
    return {
      name: barangay?.name,
      count: adminCount|| 0
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
          dataKey="count"
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
