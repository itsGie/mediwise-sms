// InventoryDashboard.js
import { TItemSms } from "@/schema/item-sms";
import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Cell,
  Legend,
  ReferenceLine,
  Brush,
  Tooltip,
} from "recharts";

type InventoryDashboard = {
  inventoryData: ({categoryName: string; count:number})[];
};
const InventoryDashboard: React.FC<InventoryDashboard> = ({
  inventoryData,
}) => {

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Categories </h1>
      <div className="w-full flex flex-col-reverse lg:flex-col-reverse">
        <div className="bg-red-100 dark:bg-slate-900 p-4 rounded-md border border-red-300 h-[70vh] w-full overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Category chart</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={inventoryData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoryName" />
              {/* <YAxis /> */}
              <YAxis />
              <Tooltip
                contentStyle={{
                  color: "black",
                }}
              />
              {/* <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} /> */}
              <ReferenceLine y={0} stroke="#000" />
              {/* <Brush dataKey="name" height={30} stroke="#8884d8" /> */}
              <Bar
                dataKey="count"
                fill="#8884d8"
                className=""
                label={{ position: "top" }}
              >
                {inventoryData.map((data, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                       "#00c400ab"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
