"use client"
import React from 'react';
import InventoryDashboard from './InventoryDashboard';
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { TItemBrgy } from '@/schema/item-brgy';
import { Session } from 'next-auth';


type CategoriesTabProps = {
};

const CategoriesTab:React.FC<CategoriesTabProps> = () => {
  // Example inventory data (you can replace this with data from your database)

  const items = useQueryProcessor<{categoryName: string; count:number}[]>({
    url: `/category/count`,
    key: ['sms-category-dashboard'],
  })

  return (
    <div>
      <InventoryDashboard inventoryData={items?.data || []} />
    </div>
  );
};

export default CategoriesTab;