import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "timeago.js";
import { apiClient, useQueryProcessor } from "@/hooks/useTanstackQuery";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {BrgyItem, Item, Notification} from '@prisma/client'
import { Session } from "next-auth";
import { useNotification } from "@/hooks/useNotification";
type UserNotificationProps = {
  currentUser?: Session["user"] | null;
};
const UserNotification = ({ currentUser }: UserNotificationProps) => {
  const notifications = useQueryProcessor<(Notification & {Item: Item & {brgyItem: BrgyItem}}) []>({url:"/notifications", key:["notifications"], queryParams: {
    userId: currentUser?.id
  },
options:{
  enabled: !!currentUser?.id
}});
  const router = useRouter()
    const unreadMessagesCount =  notifications?.data?.reduce((currentTotal, notification) => notification.isRead == false ? currentTotal + 1 : currentTotal,0) || 0
// notification:clrduo3nj0028at67xdm11xbg:create
  useNotification({
    notificationCreateKey: `notification:${currentUser?.id}:create`,
    notificationUpdateKey: `notification:${currentUser?.id}:update`,
    queryKey: ["notifications"],
  });
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mr-10">
        <Button variant={"ghost"} size={"icon"} className="relative">
          {unreadMessagesCount > 0 && (
            <span className=" flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-sm absolute top-0 right-0">
              {unreadMessagesCount}
            </span>
          )}
          <Bell className="relative w-5 h-5 fill-orange-300 text-orange-300 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className=" max-w-[300px] md:max-w-[412px] ">
        <DropdownMenuLabel>
          <h1 className="text-sm text-center">Notifications</h1>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
            <div className="max-h-[370px] overflow-y-auto flex flex-col">

        {notifications?.data?.map((notification) => (
          <div
            className={cn(" flex p-3 cursor-pointer hover:bg-zinc-200 rounded-md z-50 gap-x-3 bg-zinc-200 m-1 dark:bg-[#101627] ", notification.isRead && 'bg-white dark:bg-[#020817]')}
            key={notification.id}
            onClick={async () => {
              try {
                await apiClient.patch(`/notifications/${notification.id}`, {isRead:true})
                if(notification?.appointmentId) {
                  router.push(`/mediwise/shared/appointments/${notification.appointmentId}`)
                  return notifications.refetch()
                }
                if(notification?.transactionId && currentUser?.role != 'STOCK_MANAGER') {
                  router.push(`/shared/transactions/${notification.transactionId}`)
                  return notifications.refetch()
                } 
                if(notification?.transactionId && currentUser?.role == 'STOCK_MANAGER') {
                  router.push(`/sms/transactions/${notification.transactionId}`)
                  return notifications.refetch()
                }
                if(notification?.itemId && currentUser?.role == 'ADMIN') {
                  router.push(`/mediwise/admin/inventory/${notification.Item?.brgyItem?.id}`)
                  return notifications.refetch()
                }
              } catch (error) {
                console.error(error)
              }
              
            }}
          >
            <Bell className="relative w-5 h-5 fill-zinc-500 text-zinc-500 cursor-pointer" />
            <div className="flex flex-col">
              <span className="sm:text-sm font-semibold text-zinc-500 line-clamp-2">
                {notification.content}
              </span>
              <time className="text-sm text-zinc-500 mt-2">
                {format(new Date(notification.createdAt))}
              </time>
            </div>
          </div>
        ))}
            </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserNotification;
