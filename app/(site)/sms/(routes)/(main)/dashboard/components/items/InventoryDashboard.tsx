// InventoryDashboard.js
import { TItemSms } from "@/schema/item-sms";
import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PieChart, Pie, Sector, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, Cell, Legend, ReferenceLine, Brush, Tooltip } from "recharts";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import useWindowSize from "@/hooks/useWindowSize";
import { Item } from "@prisma/client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type InventoryDashboard = {
  inventoryData: (TItemSms & {items: Item[]})[];
};
const InventoryDashboard: React.FC<InventoryDashboard> = ({
  inventoryData,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const {height,width} = useWindowSize()

  const isMedSize = width < 700
  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };
    const itemData2 = inventoryData.map((item) => ({...item, stock: item.items?.length || 0}))
  const itemData = inventoryData.filter((item) => (item.unit === "pcs" && item?.stock! < 25) || (item.unit === "box" && item?.stock! < 5) || ( item.stock! == 0))
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
  const RADIAN = Math.PI / 180;
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
        className="text-xs"
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${payload.name} ${value} ${payload.unit}`}</text>
      </g>
    );
  };

 


  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload,value }:any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central"  className="text-xs font-semibold shadow-md">
        {`${payload.name} ${value} ${payload.unit}`}
      </text>
    );
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Inventory Items </h1>
      <div className="w-full flex flex-col-reverse lg:flex-col-reverse">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-md border border-gray-300 h-[70vh] overflow-y-auto w-full">

            <div className="border flex items-center rounded-md px-2 w-full flex-1">
        <Search className="w-5 h-5 font-semibold text-zinc-500 dark:text-white" />
        <Input
          className="inset-0 outline-none border-none active:outline-none hover:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm bg-transparent"
          onChange={onFilter}
          type="text"
          value={globalFilter}
          placeholder="Search for item"
        />
      </div>
      
              <DataTable
              //@ts-ignore
              //@ts-nocheck
              columns={columns}
              data={inventoryData || []}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
          />
            </div>
            <div className="bg-red-100 dark:bg-slate-900 p-4 rounded-md border border-red-300 h-[70vh] w-full overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2">Low Stock chart</h2>
              
               <ResponsiveContainer width="100%" height="100%">
              <BarChart
      width={500}
      height={300}
      data={itemData2}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />

      {/* <YAxis /> */}
      <Tooltip contentStyle={{
        color:"black"
      }} />
          {/* <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} /> */}
          <ReferenceLine y={0} stroke="#000" />
          {/* <Brush dataKey="name" height={30} stroke="#8884d8" /> */}

      <Bar dataKey="stock" fill="#8884d8"  label={{ position: 'top', }} >
        {itemData2.map((data, index) => (
          <Cell key={`cell-${index}`} fill={((data.unit === "pcs" && data?.items?.length! < 25) || (data.unit === "box" && data?.items?.length! < 5) || ( data?.items?.length! == 0)) ? "red" : "#00C49F"} />
        ))}
      </Bar>
    </BarChart>
              </ResponsiveContainer>
            </div>
        {/* <div className="bg-white dark:bg-slate-900 p-4 rounded-md border border-gray-300 h-[70vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Inventory List</h2>
          <ul>
            {inventoryData?.map((item) => (
              <li key={item.id} className="mb-2">
                {item.name} - Stock: {item.stock} - Dosage: {item.dosage} -
                Unit: {item.unit}
              </li>
            ))}
          </ul>
        </div> */}
        {/* <div className="bg-red-100 dark:bg-slate-900 p-4 rounded-md border border-red-300 h-[70vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Low Stock Warning</h2>
          <ul>
            {inventoryData?.map((item) => {
              if (item.unit === "pcs" && item?.stock! < 25) {
                return (
                  <li key={item.id} className="text-red-500 mb-2">
                    {item.name} - Stock: {item.stock} - Dosage: {item.dosage} -
                    Unit: {item.unit}
                  </li>
                );
              }

              if (item.unit === "box" && item?.stock! < 5) {
                return (
                  <li key={item.id} className="text-red-500 mb-2">
                    {item.name} - Stock: {item.stock} - Dosage: {item.dosage} -
                    Unit: {item.unit}
                  </li>
                );
              }
            })}
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default InventoryDashboard;
