"use client";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { TBarangay } from "@/schema/barangay";
import { TItemBrgy } from "@/schema/item-brgy";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";



const Page = () => {
  const params = useParams();
    const router = useRouter()
  const barangay = useQueryProcessor<TBarangay & { items: TItemBrgy[] }>({
    url: `/barangay/${params?.barangayId}`,
    key: ["barangay", params?.barangayId],
    queryParams: {
      barangayId: params?.barangayId,
    },
    options: {
      enabled: !!params?.barangayId,
    },
  });

  const dataItems = barangay?.data?.items.map((item) => {
    // if(item.unit === 'pcs') {
        return {
            name: item.name,
            stock: item?.stock,
        }
    // }
})

  return (
    <div className="h-[90vh] w-full p-10 flex flex-col gap-y-10">
        <span><ArrowLeft onClick={() => router.replace('/sms/barangay')} className="h-6 w-6 cursor-pointer text-zinc-500" /></span>
      <h1 className=" text-2xl font-bold ">Inventory of {barangay?.data?.name}</h1>
      <ResponsiveContainer width="100%" height="100%">
      <BarChart
          width={500}
          height={300}
          data={dataItems}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          <ReferenceLine y={0} stroke="#000" />
          <Brush dataKey="name" height={30} stroke="#8884d8" />
          <Bar dataKey="stock" fill="#F5A681" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Page;
