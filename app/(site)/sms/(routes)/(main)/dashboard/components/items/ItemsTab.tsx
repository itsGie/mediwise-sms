"use client"
import React from 'react';
import InventoryDashboard from './InventoryDashboard';
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { TItemBrgy } from '@/schema/item-brgy';
import { Session } from 'next-auth';
import { TItemSms } from '@/schema/item-sms';
import { Item } from '@prisma/client';


type ItemsTabProps = {
  currentUser: Session['user'],
  data:(TItemSms & {items: Item[]})[] | undefined
};

const ItemsTab:React.FC<ItemsTabProps> = ({currentUser, data}) => {
  // Example inventory data (you can replace this with data from your database)

  return (
    <div>
      <InventoryDashboard inventoryData={data || []} />
    </div>
  );
};

export default ItemsTab;