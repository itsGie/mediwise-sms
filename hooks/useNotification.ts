import { useSocket } from "@/components/providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {Notification} from '@prisma/client'
type UseNotificationProps = {
  notificationCreateKey: string;
  notificationUpdateKey: string;
  queryKey: (string | any)[];
};

export const useNotification = ({
  queryKey,
  notificationCreateKey,
  notificationUpdateKey,
}: UseNotificationProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(
      notificationCreateKey,
      (
        data: Notification
      ) => {
        queryClient.setQueryData(
          queryKey,
          (
            oldData: Notification[]
          ) => {
            console.log('notificationCreateKey', data, oldData)
            if(typeof oldData === 'undefined' || oldData?.length <= 0) {
                const newData = [data];
                return newData;
              }
              
              const newData = [data, ...oldData];
                return newData;
          }
        );
      }
    );

    socket.on(notificationUpdateKey, (data: any) => {
      console.log("notification update", data);
    });

    return () => {
      socket.off(notificationUpdateKey);
      socket.off(notificationCreateKey);
    };
  }, [notificationCreateKey, notificationUpdateKey, queryKey]);
};
