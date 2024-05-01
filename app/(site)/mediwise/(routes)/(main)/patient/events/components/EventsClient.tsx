"use client";
import { Separator } from "@/components/ui/separator";
import { TUserRaw } from "@/schema/user";
import Event from "./Event";
import React, { useEffect } from "react";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Loader2 } from "@/components/ui/Loader";
import { EventSchemaType } from "@/schema/event";
import { TBarangay } from "@/schema/barangay";

type EventsClientProps = {
  currentUser: TUserRaw;
};

const EventsClient: React.FC<EventsClientProps> = ({ currentUser }) => {
  const events = useQueryProcessor<
    (EventSchemaType & { barangay: TBarangay })[]
  >({
    url: `/events`,
    key: ["events", currentUser.barangayId],
    queryParams: {
      barangayId: currentUser.barangayId,
    },
    options: {
      enabled: !!currentUser.barangayId,
    },
  });

  return (
    <div className="w-full">
      {/* <h1 className="text-5xl md:text-[10em] font-black text-center">FORUMS</h1> */}

      <section className="bg-[#212121] w-full overflow-auto h-screen px-14 lg:px-40">
        <div className="gap-y-10 flex flex-col">
          <h1 className="capitalize text-white text-lg md:text-3xl mt-10">
            Upcoming events
          </h1>
          <Separator />
        </div>

        {/* events */}
        {(() => {
          if (events.status === "pending") {
            return (
              <div className="flex justify-center">
                <Loader2 size={50} />
              </div>
            );
          }

          if (events.status === "error") {
            return (
              <div className="flex justify-center">Something went wrong.</div>
            );
          }

          if (events.data.length <= 0) {
            return <div className="flex justify-center text-white text-3xl mt-10">No events found</div>;
          }

          return (
            <section className="flex flex-col py-10 gap-y-5">
              {events.data.map((event) => (
                <Event data={event} key={event.id} />
              ))}
            </section>
          );
        })()}
      </section>
    </div>
  );
};

export default EventsClient;
