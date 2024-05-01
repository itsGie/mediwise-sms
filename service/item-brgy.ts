import "server-only";

import prisma from "@/lib/prisma";
import {
  TCreateBrgyItem,
  TItemBrgy,
  TUpdateBrgyItem,
} from "@/schema/item-brgy";
import { Item } from "@prisma/client";

// getAllBarangayItem
export const getAllBarangayItem = async (data: {
  name?: string,
  barangayId?:string,
}): Promise<(TItemBrgy & {items: Item[]})[]> => {
  return await prisma.brgyItem.findMany({
    where: {
      name: {
        contains: data.name ?? undefined,
      },
      barangayId: data.barangayId ?? undefined
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items:true,
      onhand_items:true,
      appointmentItems:true,
      category:true,
    }
  });
};

// getBarangayItemById
export const getBarangayItemById = async (
  id: string
): Promise<TItemBrgy | null> => {
  return await prisma.brgyItem.findUnique({
    where: {
      id: id,
    },
    include: {
      items:true,
      category:true,
    }
  });
};

// createBarangayItem
export const createBarangayItem = async (
  data: TCreateBrgyItem
): Promise<TItemBrgy> => {
  return await prisma.brgyItem.create({
    data: {
      name: data.name,
      unit: data.unit,
      description: data.description,
      // stock: Number(data.stock),
      category_id: data?.category_id,
      barangayId: data.brgyId,
      dosage:data?.dosage
    },
  });
};

// updateBarangayItem
export const updateBarangayItemById = async (
  id: string,
  data: TUpdateBrgyItem
): Promise<TItemBrgy> => {
  return await prisma.brgyItem.update({
    where: {
      id,
    },
    data,
  });
};

// deleteBarangayItem
export const deleteBarangayItemById = async (id: string) => {
  return await prisma.brgyItem.delete({
    where: {
      id,
    },
  });
};
