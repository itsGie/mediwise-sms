import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  PolarGrid,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { schemeCategory10 } from "d3-scale-chromatic";
type IllnessChartProps = {
  data: {
    _count: {
      illness: number;
    };
    illness: string;
  }[];
};

export default function IllnessChart({ data }: IllnessChartProps) {
  // 768px
  const colors = schemeCategory10.slice(0, data.length);
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    payload: { illness, _count },
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white">
         {_count.illness}
      </text>
    );
  };

  return (
    <div className="w-full h-full flex">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="_count.illness"
            data={data}
            label={renderCustomizedLabel}
            labelLine={false}
            innerRadius={70}
            outerRadius={150}
            fill="#82ca9d"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col">
        {data.map((illness, index) => {

          return (
            <div className="flex items-center gap-2" key={index}>
              <div
              style={{
                background: `${colors[index % colors.length]}`
              }}
                className={`w-2 h-2 rounded-full`}
              />
              <span>{illness?.illness}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
