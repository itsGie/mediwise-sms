"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useModal } from "@/hooks/useModalStore";
import {
  apiClient,
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { useQueryClient } from "@tanstack/react-query";
import {
  AppoinmentStatus,
  Appointment,
  Profile,
  Role,
  User,
  WorkSchedule,
} from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "next-auth";

import { TProfile, TUser } from "@/schema/user";
import Avatar from "@/components/Avatar";
import moment from "moment-timezone";
import AppointmentItem from "./AppointmentItem";
import { Button } from "@/components/ui/button";
import { Divide } from "lucide-react";
import { Loader2 } from "@/components/ui/Loader";
import { cn } from "@/lib/utils";
import useWindowSize from "@/hooks/useWindowSize";
type CalendarClientProps = {
  currentUser: TUser;
};

const Calendar: React.FC<CalendarClientProps> = ({ currentUser }) => {
  const { onOpen, onClose } = useModal();
  const { toast } = useToast();
  const [selectInfo, setSelectInfo] = useState<any>();
  const workSchedules = useQueryProcessor<
    (WorkSchedule & { doctor: TUser & { profile: Profile } })[]
  >({
    url: `/work-schedules`,
    key: ["work-schedules",  currentUser.barangayId],
    queryParams: {
      barangayId: currentUser.barangayId,
    },
  });

  const { width } = useWindowSize();
  const isMobileOrTablet = width < 768; 
  
  const currentworkSchedules =
    typeof workSchedules.data !== "undefined" && workSchedules?.data?.length > 0
      ? workSchedules.data.map((workSchedule) => {
          const { doctor } = workSchedule;
          return {
            id: workSchedule?.id,
            title: workSchedule?.title,
            start: workSchedule?.start,
            end: workSchedule?.end,
            allDay: workSchedule?.allDay,
            doctorName: `${doctor?.profile?.firstname} ${doctor?.profile?.lastname}`,
            image: doctor?.image,
          };
        })
      : [];

  const handleDateSelect = (selectInfo: any) => {
    const calendarApi = selectInfo;
    
      onOpen('addDoctorSchedule', {calendarApi, user:currentUser})
    
    // onOpen("addWorkSchedule", { calendarApi, user: currentUser });
  };

  type EventData = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    doctorId: string;
    barangayId: string;
  };

  // const currentAppointment = useQueryProcessor<
  //   (Appointment & {
  //     doctor: TUser & { profile: TProfile };
  //     patient: TUser & { profile: TProfile };
  //   })[]
  // >({
  //   url: "/appointments",
  //   key: ["appointments", currentUser.id],
  //   queryParams: {
  //     date: selectInfo?.startStr,
  //     barangayId: currentUser.barangayId,
  //   },
  // });

  // useEffect(() => {
  //   currentAppointment.refetch();
  // }, [selectInfo]);

  // const appointments = currentAppointment.data?.filter((appointment) => appointment.status === 'ACCEPTED' || appointment.status === 'PENDING' )

  const createDoctorSchedule = useMutateProcessor<EventData, null>({
    url: "/work-schedules/admin",
    method: "POST",
    key: ["work-schedules",  currentUser.barangayId],
  });

  const handleAddEvent = ({ event }: any) => {

    const eventData = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      doctorId: event?._def.extendedProps.doctorId,
      barangayId: event?._def?.extendedProps?.barangayId
    } as EventData;

    console.log("event Data", eventData)
    createDoctorSchedule.mutate(eventData, {
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Schedule has been added",
        });
      },
      onError(error:any, variables, context) {
        console.error(error.response.data.message);
        console.log(error)
        toast({
          title: error.response.data.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdateEvent = ({ event }: any) => {
    // const eventData = {
    //   id: event.id,
    //   title: event.title,
    //   timeStart: event.start,
    //   timeEnd: event.end,
    //   allDay: event.allDay,
    // };
    // updateEvent(event.id, eventData);
  };

  const handleEventClick = (calendarApi: any) => {
    // onOpen("viewEvent", { calendarApi });
  };

  const handleDeleteEvent = ({ event }: any) => {
    console.log("deleting event");
    // deleteEvent(event.id);
  };

  const disabledTimes = [
    '09:00', '10:30', '14:00' // Example disabled times
  ];
  
  const isTimeDisabled = (time:any) => {
    console.log('hello')
    return disabledTimes.includes(time);
  };



  return (
    <div className="w-full h-full flex gap-x-3 flex-col md:flex-row py-10">
      <div className="w-full">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          dayHeaderClassNames={"text-sky-700 text-sm font-medium uppercase"}
          validRange={{
            start: new Date(),
          }}
          height={"85vh"}
          initialView="timeGridWeek"
          // longPressDelay={0}

          // selectAllow={(event) => {
          //   const dateStart = new Date(event.startStr);
          //   const dateEnd = new Date(event.endStr);

          //   // To calculate the time difference of two dates
          //   const Difference_In_Time = dateEnd.getTime() - dateStart.getTime();

          //   // To calculate the no. of days between two dates
          //   const Difference_In_Days = Math.round(
          //     Difference_In_Time / (1000 * 3600 * 24)
          //   );

          //   return Difference_In_Days === 1;
          // }}

          selectConstraint={{
            startTime: '08:00', // Example start time
            endTime: '24:00', // Example end time
            // allDay:true,
            businessHours: { // Define business hours
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '08:00',
              endTime: '24:00',
              
            },
            isConstraint: true, // Disable times not within business hours
            constraint: {
              startTime: '08:00',
              endTime: '24:00',
              
            },
            // Custom function to disable specific times
            constraintCustom: ({ date, start, end }:any) => {
              const time = start.toTimeString()?.slice(0, 5); // Extract time from DateTime object
              return !isTimeDisabled(time);
            }
          }}

          eventContent={EventContent}
          editable={false}
          selectable={true}
          selectMirror={true}
          droppable={true}
          dayMaxEvents={1}
          eventBackgroundColor={"#449e65"}
          eventColor={"#449e65"}
          weekends={true}
          // @ts-ignore
          // @ts-nocheck
          events={currentworkSchedules}
          // initialEvents={currentEvents} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect} // adding event
          eventClick={handleEventClick} // trigger when clicking an event
          //  eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          // you can update a remote database when these fire:
          eventAdd={handleAddEvent}
          eventChange={handleUpdateEvent}
          eventRemove={handleDeleteEvent} // triggen when you delete an event in event api
        />
      </div>
    </div>
  );

 

};

export default Calendar;


const EventContent: React.FC = (eventInfo: any) => {
  
  const getTime = (date: Date) => {
    const formattedTime = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return formattedTime
  }

    const deleteEvent = async (eventId: string) => {
        try {
          await apiClient.delete(`/work-schedules/${eventId}`);
          // toast({title:"Schedule deleted"});
        } catch (error) {
          console.error("error delete event");
          // toast({title:"Schedule did not delete", variant: 'destructive'});
        } finally {
          // queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
        }
      };


  if(!eventInfo.event.allDay) {
    console.log(eventInfo.event?.startStr," - ", eventInfo.event?.endStr)

    const dateStart = new Date(eventInfo.event?.startStr);
    const dateEnd = new Date(eventInfo.event?.endStr);


    const formattedStartTime = getTime(dateStart)
    const formattedEndTime = getTime(dateEnd)

    console.log(formattedStartTime, formattedEndTime); // Output: 09:35 PM
    

    return (
      <div className="flex text-sm cursor-pointer gap-x-2 w-full overflow-auto" 
      // onClick={() => deleteEvent(eventInfo.event?.id)}
      >
        <Avatar className="min-w-10" src={eventInfo.event?._def?.extendedProps?.image} />
        <div className="flex items-center gap-x-3 flex-col">
          <span>{eventInfo.event?._def?.extendedProps?.doctorName}</span>
          <span >{formattedStartTime} - {formattedEndTime}</span>
        </div>
      </div>
    );

  }

  return (
    <div className="flex items-center gap-x-3 text-sm cursor-pointer overflow-auto" 
    // onClick={() => deleteEvent(eventInfo.event?.id)}
    >
      <Avatar className="min-w-10" src={eventInfo.event?._def?.extendedProps?.image} />
      <span>{eventInfo.event?._def?.extendedProps?.doctorName}</span>
    </div>
  );
};



