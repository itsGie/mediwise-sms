import "server-only";

import prisma from "@/lib/prisma";
import {
  TItemTransaction,
  TCreateItemTransaction,
  TItemTransactionGetQuery,
  TUpdateItemTransaction,
  TRequestedItem,
} from "@/schema/item-transaction";
import { da } from "@faker-js/faker";

//get all transaction
export const getAllItemTransaction = async ({
  data,
}: {
  data: TItemTransactionGetQuery;
}): Promise<TItemTransaction[]> => {
  return await prisma.itemTransaction.findMany({
    where: {
      barangayId: data.barangayId,
      status: data.status,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      requested_items: true,
      barangay:true,
      barangayUser:true,
    },
  });
};

//get transaction by id
export const getItemTransactionById = async ({
  id,
}: {
  id: string;
}): Promise<TItemTransaction | null> => {
  return await prisma.itemTransaction.findUnique({
    where: {
      id: id,
    },
    include: {
      requested_items: {
        include: {
          item:{
            include: {
              items:true
            }
          }
        }
      },
      barangay:true,
      barangayUser:{
        include: {
          profile:true
        }
      },
    },
  });
};

//create transaction
// export const createItemTransaction = async ({
//   data,
// }: {
//   data: TCreateItemTransaction;
// }): Promise<TItemTransaction> => {
//   const formattedRequestedItems = data.requestedItems.map((item) => {
//     return {
//       itemId: item.itemId,
//       quantity: item.quantity,
//     };
//   });

//   return await prisma.itemTransaction.create({
//     data: {
//       description: data.description,
//       barangayId: data.barangayId,
//       status: data.status,
//       requested_items: {
//         create: formattedRequestedItems,
//       },
//     },
//     include: {
//       requested_items: true,
//     },
//   });
// };

// update transaction
export const updateItemTransaction = async ({
  id,
  data,
}: {
  id: string;
  data: TUpdateItemTransaction;
}): Promise<TItemTransaction> => {
  return await prisma.itemTransaction.update({
    where: {
      id,
    },
    data,
    include: {
      requested_items: true,
    },
  });
};

// delete transaction
export const deleteItemTransaction = async ({
  id,
}: {
  id: string;
}): Promise<TItemTransaction> => {
  return await prisma.itemTransaction.delete({
    where: {
      id,
    },
    include: {
      requested_items: true,
    },
  });
};

/* 
  Requested Item functions
*/

// check if all the requested items are available in sms item database
// and no zero or negative quantity
export const checkIfAllItemsAreAvailable = async ({
  data,
}: {
  data: {
    requested_items: {
      id: string;
      quantity: number;
    }[];
  };
}): Promise<boolean> => {
  const requested_items = data.requested_items;

  const itemsAvailable = await Promise.all(
    requested_items.map(async (requested_item) => {
      const itemAvailable = await prisma.smsItem.findUnique({
        where: {
          id: requested_item.id,
        },
      });

      // ensure that all the required data is available
      if (!itemAvailable || !itemAvailable.stock) {
        return false;
      }

      // id sms item stock is greater than or equal to the requested quantity then return true
      if (itemAvailable.stock >= requested_item.quantity) {
        return true;
      }
    })
  );

  return !itemsAvailable.includes(false);
};

// transfer item from sms item database to barangay item database
export const transferSmsItemsToBarangayItems = async ({
  data,
}: {
  data: { requested_items: TRequestedItem[]; brgyId: string };
}): Promise<boolean> => {
  const itemsTransfered = await Promise.all(
    data.requested_items.map(async (requested_item) => {
      // get sms item
      const itemAvailable = await prisma.smsItem.findUnique({
        where: {
          id: requested_item.id,
        },
      });

      // get barangay item
      const barangayItem = await prisma.brgyItem.findUnique({
        where: {
          id: requested_item.itemId || undefined,
        },
      });

      // ensure that all the required data is available
      if (
        !itemAvailable ||
        !itemAvailable.stock ||
        !barangayItem ||
        !requested_item.itemId
      ) {
        return false;
      }

      // is sms item stock is not greater than or equal to the requested quantity then return false
      if (itemAvailable.stock < requested_item.quantity) {
        return false;
      }

      // deduct the sms item stock by the requested quantity
      await prisma.smsItem.update({
        where: {
          id: requested_item.id,
        },
        data: {
          stock: itemAvailable.stock - requested_item.quantity,
        },
      });

      // if barangay item is not yet created then create it
      if (!barangayItem || !barangayItem.stock) {
        await prisma.brgyItem.create({
          data: {
            description: itemAvailable.description,
            name: itemAvailable.name,
            stock: requested_item.quantity,
            barangayId: data.brgyId,
          },
        });
      } else {
        // if barangay item is already created then update the stock
        await prisma.brgyItem.update({
          where: {
            id: requested_item.itemId,
            barangayId: data.brgyId,
          },
          data: {
            stock: barangayItem.stock + requested_item.quantity,
          },
        });
      }
    })
  );

  // return false if there is an error in transferring items
  return !itemsTransfered.includes(false);
};
