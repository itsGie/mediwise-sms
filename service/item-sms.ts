import "server-only";

import prisma from "@/lib/prisma";
import { TCreateSmsItem, TItemSms, TUpdateSmsItem } from "@/schema/item-sms";

// getAllSmsItem
export const getAllSmsItem = async (data: {
  name?: string;
  medicineNames?: string[]
}): Promise<TItemSms[]> => {
  return await prisma.smsItem.findMany({
    where: {
      name: {
        contains: data.name,
      },
      isArchive:false
    },
    include: {
      supplier:true,
      items:true,
      category:true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// getSmsItemById
export const getSmsItemById = async (id: string): Promise<TItemSms | null> => {
  return await prisma.smsItem.findUnique({
    where: {
      id: id,
    },
    include: {
      supplier:true,
      items:true
    }
  });
};

// createSmsItem
export const createSmsItem = async (
  data: TCreateSmsItem
): Promise<TItemSms> => {
  return await prisma.smsItem.create({
    data,
  });
};

// updateSmsItem
export const updateSmsItemById = async (
  id: string,
  data: TUpdateSmsItem
): Promise<TItemSms> => {
  return await prisma.smsItem.update({
    where: {
      id,
    },
    data,
  });
};

// deleteSmsItem
export const deleteSmsItemById = async (id: string) => {
  return await prisma.smsItem.delete({
    where: {
      id,
    },
  });
};
