import { Separator } from "@/components/ui/separator";
import { TBarangay } from "@/schema/barangay";
import { EventSchemaType } from "@/schema/event";
import { Clock, MapPin, Pin, Waypoints } from "lucide-react";
import React from "react";

type EventProps = {
  data: EventSchemaType & { barangay: TBarangay };
};
const Event: React.FC<EventProps> = ({ data }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[new Date(data.start).getMonth()];
  const day =
    new Date(data.start).getDate() < 10
      ? `0${new Date(data.start).getDate()}`
      : new Date(data.start).getDate();

  const formattedDate = new Date(data?.start)?.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const startTime = new Date(data?.start)?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const endTime = new Date(
    data?.end
    ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const formattedString = `${formattedDate} at ${startTime}`;
  return (
    <div className="flex gap-16  flex-col items-center lg:flex-row lg:items-start"  >
      <div className="flex gap-y-5">
      {
        data?.image_url && <img className="h-full  object-contain w-full rounded-md max-h-[500px]" src={data?.image_url} />
      }
      </div>

      <div className="flex flex-col gap-y-5 items-center">
        <span className="text-[#90EE74] text-4xl font-extrabold">{month}</span>
        <Separator className="h-1" />
        <span className="text-white text-4xl font-extrabold">{day}</span>
      </div>
      <div className="flex flex-col gap-y-3">
        <h1 className="text-3xl font-semibold text-white">{data.title}</h1>

        <div className="flex flex-col gap-y-1">
          {/* <span className="flex items-center gap-x-3 text-white">
            <MapPin className="w-5 h-5 text-[#90EE74]" />
            <p> {data.barangay.name} Caloocan city </p>
          </span> */}
          <span className="flex items-center gap-x-3 text-white">
            <Clock className="w-5 h-5 text-[#90EE74]" />
            <p>{formattedString}</p>
          </span>
        </div>

        <p className="text-white mt-10">{data.description}</p>
      </div>
    </div>
  );
};

export default Event;
