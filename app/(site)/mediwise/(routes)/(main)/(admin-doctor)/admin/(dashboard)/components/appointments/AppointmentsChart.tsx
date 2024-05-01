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
import { AppointmentsTotalType } from "./AppointmentsTab";

type AppointmentsChartProps = {
  data: AppointmentsTotalType[];
};

export default function AppointmentsChart({ data }: AppointmentsChartProps) {
  // 768px
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
          <YAxis   />
        
        <Tooltip contentStyle={{
        color:"black"
      }}  />
        <Area
          type="monotone"
          dataKey="numberOfAppointments"
          stackId="1"
          stroke="#0d2b13"
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
