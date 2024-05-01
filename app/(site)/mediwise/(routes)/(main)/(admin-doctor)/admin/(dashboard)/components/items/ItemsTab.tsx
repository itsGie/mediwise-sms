"use client"
import React from 'react';
import InventoryDashboard from './InventoryDashboard';
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { TItemBrgy } from '@/schema/item-brgy';
import { Session } from 'next-auth';
import { Item } from '@prisma/client';


type ItemsTabProps = {
  currentUser: Session['user']
};

const ItemsTab:React.FC<ItemsTabProps> = ({currentUser}) => {
  // Example inventory data (you can replace this with data from your database)
  const items = useQueryProcessor<(TItemBrgy & {items: Item[]})[] >({
    url: "/brgy-item",
    key: ["inventory-items", "barangay"],
    queryParams:{
      barangayId: currentUser.barangayId
    },
    options: {
      enabled: !!currentUser.barangayId
    }
  });

  return (
    <div>
      <InventoryDashboard inventoryData={items?.data || []} />
    </div>
  );
};

export default ItemsTab;