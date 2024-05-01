import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  TItemTransaction,
  TRequestedItem,
  UpdateItemTransactionSchema,
} from "@/schema/item-transaction";
import {
  checkIfAllItemsAreAvailable,
  deleteItemTransaction,
  getItemTransactionById,
  transferSmsItemsToBarangayItems,
  updateItemTransaction,
} from "@/service/item-transaction";
import { ItemTransactionStatus, Role } from "@prisma/client";
import axios from "axios";
import nodeSchedule from 'node-schedule'

import { NextResponse } from "next/server";

export const GET = withAuth(
  async ({ req, session, params }) => {
    try {
      const transaction = await getItemTransactionById({
        id: params.itemtransactionID,
      });

      if (!transaction) {
        return NextResponse.json(
          {
            message: "Transaction not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(transaction);
    } catch (error) {
      console.log("[GET_ITEMTRANSACTION_BY_ID]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
    allowAnonymous: true,
  }
);

export const PUT = withAuth(
  async ({ req, session, params}) => {
    try {
     const requestedItems = await req.json()

      const transactionId = await prisma.itemTransaction.findUnique({
        where: {
          id: params.itemtransactionID
        }
      })

      if(!transactionId) {
        return NextResponse.json(
          {
            message: "Transaction not found",
          },
          { status: 404 }
        );
      }

      const transaction = await prisma.itemTransaction.update({
        where: {
          id: transactionId.id
        },
        data: {
          status: 'ONGOING',
          requested_items: {
            createMany: {
              data: requestedItems.map((requestedItem:any) => ({itemId: requestedItem.itemId, quantity: requestedItem.quantity}))
            }
          }
        }
      })

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/transactions/${transaction.id}`,
        {
          transactionId: transaction.id,
        }
      );

      
      return NextResponse.json({}, { status: 201 });
    } catch (error) {
      console.log("[TRANSACTION_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
  }
);

export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await UpdateItemTransactionSchema.safeParseAsync(
        await req.json()
      );

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const transaction = await getItemTransactionById({
        id: params.itemtransactionID,
      });
      
      if (
        !transaction ||
        !transaction.requested_items ||
        !transaction.barangayId
      ) {
        return NextResponse.json(
          {
            message: "Transaction not found",
          },
          { status: 404 }
        );
      }

      const formattedRequestedItems = transaction.requested_items.map(
        (item) => {
          return {
            id: item.id as string,
            quantity: item.quantity,
            itemId: item.itemId,
          };
        }
      );

      const smsItems = await prisma.smsItem.findMany({
        where: {
          id: {
            in: formattedRequestedItems.map((item) => item.itemId) as string[]
          }
        },
        include: {
          items:true
        }
      })
      
      const isNotAvailable = smsItems.some((item) => {
        const findItem = formattedRequestedItems.find((formattedItem) => formattedItem.itemId === item.id)
        return item?.items.length! <= 0 || (findItem && item?.items.length! < findItem?.quantity)
      })

      // console.log(isSmsItemsAvailable)
      if (isNotAvailable) {
        return NextResponse.json(
          {
            message:
              "Could not proceed to update transaction because some of the requested items are not available or out of stock",
          },
          { status: 400 }
        );
      }

      let transactionUpdate: TItemTransaction | null = null;

      const isStatusAllowed = (
        status: string,
        allowedStatus: ItemTransactionStatus[]
      ) => {
        return allowedStatus.includes(status as ItemTransactionStatus);
      };

      if (
        session.user.role === Role.STOCK_MANAGER &&
        transaction.status === ItemTransactionStatus.PENDING &&
        isStatusAllowed(body.data.status, ["ONGOING", "CANCELLED"])
      ) {

        /* 
          if the current transaction is pending and if the stock manager accepts or rejects the transaction

          if the stock manager accepts the transaction, the status of the transaction will be changed to ACCEPTED and the delivery status is ON THE WAY
          if the stock manager rejects the transaction, the status of the transaction will be changed to REJECTED
        */

        transactionUpdate = await updateItemTransaction({
          id: params.itemtransactionID,
          data: {
            status: body.data.status, // data can be ACCEPTED or REJECTED
          },
        });

        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/transactions/${transaction.id}`,
          {
            transactionId: transaction.id,
            status: body.data.status
          }
        );

      } else if (
        (session.user.role === Role.STOCK_MANAGER || session.user.role === Role.ADMIN) &&
        transaction.status === ItemTransactionStatus.ONGOING &&
        isStatusAllowed(body.data.status, ["COMPLETED"])
      ) {
        /* 
          if the current transaction is ACCEPTED and if the barangay admin confirms the received items 
        */

        transactionUpdate = await updateItemTransaction({
          id: params.itemtransactionID,
          data: {
            status: body.data.status,
          },
        });

        


        // console.log(transaction)
        // // update the quantity of the items in the sms item database and barangay item database

        const itemsToCreate = smsItems.map((smsItem) => {
          const item = formattedRequestedItems.find(formattedItem => formattedItem.itemId === smsItem.id)
          return {
          barangayId: transaction.barangayId,
          name: smsItem.name,
          dosage: smsItem.dosage,
          stock: item?.quantity,
          unit: smsItem.unit,
          requestId: transaction.id,
          items: smsItem.items
          }
        })

        const updateSmsItemToBarangay = async (data: typeof smsItems[number]) => {
          const item = formattedRequestedItems.find(formattedItem => formattedItem.itemId === data.id)
          let items = []
          for(let i = 0; i < item?.quantity!; i++) {
            items.push({
              id: data.items[i].id,
              product_number: data.items[i].product_number,
              expiration_date: data.items[i]?.expiration_date,
            })
          }

          const existingItem = await prisma.brgyItem.findFirst({
            where: {
              name: data.name,
              barangayId:transaction.barangayId,
              unit: data.unit
            }
          })


          if(existingItem) {
            const updatedItems = await Promise.all(items.map(async(data) => {
              const item = await prisma.item.update({
                where: {
                  id: data.id
                },
                data: {
                  onhandItemId:existingItem.id,
                  brgyItemId: existingItem.id,
                  product_number: data.product_number,
                  expiration_date: data?.expiration_date,
                  smsItemId: null,
                }
              })

              const reminderTime = new Date(item.expiration_date || new Date());
              reminderTime.setDate(reminderTime.getDate() - 7);
              nodeSchedule.scheduleJob(item.id, reminderTime, async () => {
              const administrators = await prisma.user.findMany({
                where: {
                  role: 'ADMIN',
                  barangayId: transaction.barangayId
                }
              })
      
              Promise.all(administrators.map(async(admin) => {
                const notification = await prisma.notification.create({
                  data: {
                    content: `Your Item will be expire in 7 days`,
                    itemId:item.id,
                    userId: admin.id,
                  }
                })
      
                return notification
              }))
            })


              return item;
            }))

            console.log(updatedItems)
            return updatedItems
          }

          const brgyItem = await prisma.brgyItem.create({
            data: {
              barangayId: transaction.barangayId,
              name: data.name,
              dosage: data.dosage,
              stock: item?.quantity,
              unit: data.unit,
              requestId: transaction.id,
            }
          })

          await Promise.all(items.map(async(data) => {
            const item = await  prisma.item.update({
              where: {
                id: data.id
              },
              data: {
                onhandItemId: brgyItem.id,
                brgyItemId: brgyItem.id,
                product_number: data.product_number,
                expiration_date: data?.expiration_date,
                smsItemId: null,
              }
            })

            const reminderTime = new Date(item.expiration_date || new Date());
            reminderTime.setDate(reminderTime.getDate() - 7);
            nodeSchedule.scheduleJob(item.id, reminderTime, async () => {
            const administrators = await prisma.user.findMany({
              where: {
                role: 'ADMIN',
                barangayId: transaction.barangayId
              }
            })
    
            Promise.all(administrators.map(async(admin) => {
              const notification = await prisma.notification.create({
                data: {
                  content: `Your Item will be expire in 7 days`,
                  itemId:item.id,
                  userId: admin.id,
                }
              })
    
              return notification
            }))
          })


            return item;
          }))

          return brgyItem
        }

        const items = await Promise.all(
          smsItems.map((data) => updateSmsItemToBarangay(data))
        );

        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/transactions/${transaction.id}`,
          {
            transactionId: transaction.id,
            status: "COMPLETED"
          }
        );


        // formattedRequestedItems.forEach(async (smsItem) => (
        //   prisma.smsItem.update({
        //     where: {
        //       id: smsItem.itemId as string,
        //     },
        //     data: {
        //       stock: {
        //         decrement: smsItem.quantity
        //       }
        //     }
        //   })
        // ))
        
      } 

      return NextResponse.json(transactionUpdate, { status: 201 });
    } catch (error) {
      console.log("[ITEMTRANSACTION_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN", "STOCK_MANAGER"],
  }
);

export const DELETE = withAuth(
  async ({ req, session, params }) => {
    try {
      const transaction = await getItemTransactionById({
        id: params.itemtransactionID,
      });

      if (!transaction || !transaction.requested_items) {
        return NextResponse.json(
          {
            message: "Transaction not found",
          },
          { status: 404 }
        );
      }

      // only allow to delete transaction if the status is PENDING
      if (transaction.status !== ItemTransactionStatus.PENDING) {
        return NextResponse.json(
          {
            message:
              "Could not delete transaction because the status is not PENDING",
          },
          { status: 400 }
        );
      }

      const itemDeleted = await deleteItemTransaction({
        id: params.itemtransactionID,
      });

      return NextResponse.json(itemDeleted, { status: 200 });
    } catch (error) {
      console.log("[ITEMTRANSACTION_DELETE]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["STOCK_MANAGER"],
  }
);
