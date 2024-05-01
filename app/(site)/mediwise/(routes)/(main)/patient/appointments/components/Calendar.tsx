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
    key: ["work-schedules"],
    queryParams: {
      barangayId: currentUser.barangayId,
    },
  });

  const { width } = useWindowSize();
  const isMobileOrTablet = width < 768;

  const currentworkSchedules =
    typeof workSchedules.data !== "undefined" && workSchedules?.data?.length > 0
      ? workSchedules.data.map((workSchedule) => {
          const { doctor,  } = workSchedule;
          return {
            id: workSchedule?.id,
            title: workSchedule?.title,
            start: workSchedule?.start,
            end: workSchedule?.end,
            allDay: workSchedule?.allDay,
            specialist: `${doctor.profile.specialist}`,
            doctorName: `${doctor.profile.firstname} ${doctor.profile.lastname}`,
            image: doctor?.image,
          };
        })
      : [];

  console.log(currentworkSchedules);

  const handleDateSelect = (selectInfo: any) => {
    const calendarApi = selectInfo;
    setSelectInfo(calendarApi);

    if (isMobileOrTablet) {
      onOpen("appointmentSide", { calendarApi, user: currentUser });
    }
    // onOpen("addWorkSchedule", { calendarApi, user: currentUser });
  };

  // const dayCellContent = (arg:any) => {
  //     console.log(arg)
  // const currentDate = new Date(arg.date)
  // const endDate = new Date(currentDate);
  // // endDate.setDate(currentDate.getDate() + 1);

  // const isDisabled = currentworkSchedules.some((event) => {
  //   const eventStartDate = new Date(event?.start!);
  //   const eventEndDate = new Date(event?.end!);

  //   // Check if the current date falls within the event range
  //   if (currentDate >= eventStartDate && currentDate < eventEndDate) {
  //     return true;
  //   }

  //   // Check if the current date is the end date of a multi-day event
  //   if (currentDate.getTime() === eventEndDate.getTime()) {
  //     return true;
  //   }

  //   // Check if the current date is the start date of a multi-day event
  //   if (endDate >= eventStartDate && endDate < eventEndDate) {
  //     return true;
  //   }

  //   return false;
  // });

  // // const hasEvent = currentworkSchedules.some((event) => {
  // //   const eventStartDate = event?.start?.toString()?.substring(0, 10); // Extracting date part
  // //   return eventStartDate === currentDate;
  // // });

  // if (!isDisabled) {
  //   arg.isDisabled = true
  // }
  // };


  const dayCellContent = (arg: any) => {

    const cellDate = new Date(arg.date);
    
    const isWithinEvent = currentworkSchedules.some((event) => {

      if(event.allDay) {
        const eventStartDate = new Date(event.start!);
        const eventEndDate = new Date(event.end!);
        return cellDate >= eventStartDate && cellDate < eventEndDate;
      }
      else {
        const eventStartDate = new Date(event.start!)
        const eventEndDate = new Date(event.end!)
        eventStartDate.setDate(eventEndDate.getDate() - 1)
        eventEndDate.setDate(eventEndDate.getDate() - 1)
        const eventStartDate2 = eventEndDate.toISOString().substring(0, 10);
        const eventEndDate2 = eventEndDate.toISOString().substring(0, 10);
        return cellDate.toISOString().substring(0, 10) == eventStartDate2 || cellDate.toISOString().substring(0, 10) == eventEndDate2;
      }
      
    });

    if (!isWithinEvent) {
      arg.el.classList.add("disabled-cell");
    } 
  };

  // console.log(currentworkSchedules)
  type EventData = {
    id: string;
    title: string;
    date: Date;
    allDay: boolean;
    doctorId: string;
    patientId: string;
    illness: string;
    status: AppoinmentStatus;
    barangayId: string;
  };

  const currentAppointment = useQueryProcessor<
    (Appointment & {
      doctor: TUser & { profile: TProfile };
      patient: TUser & { profile: TProfile };
    })[]
  >({
    url: "/appointments",
    key: ["appointments", currentUser.id],
    queryParams: {
      date: selectInfo?.startStr,
      barangayId: currentUser.barangayId,
    },
  });

  const numberOfAppointments =
    currentAppointment.data?.filter(
      (appointment) =>
        appointment.status === "ACCEPTED" || appointment.status === "PENDING"
    )?.length || 0;
  const limit = 25;
  const limitExceeded = numberOfAppointments >= limit;

  useEffect(() => {
    currentAppointment.refetch();

  }, [selectInfo]);

  useEffect(() => {
    if(currentAppointment.status === 'success' && limitExceeded && selectInfo) {
      onOpen("appointmentWarning", { calendarApi: selectInfo });
    }
  }, [currentAppointment.data])


  const appointments = currentAppointment.data?.filter(
    (appointment) =>
      appointment.status === "ACCEPTED" || appointment.status === "PENDING"
  );

  const createAppointment = useMutateProcessor<EventData, null>({
    url: "/appointments",
    method: "POST",
    key: ["appointments", currentUser.id],
  });

  const handleAddEvent = ({ event }: any) => {
    const eventData = {
      id: event.id,
      title: event.title,
      date: event.start,
      doctorId: event?._def.extendedProps.doctorId,
      patientId: event?._def.extendedProps.patientId,
      illness: event?._def.extendedProps.illness,
      status: event?._def.extendedProps.status,
      barangayId:
        event?._def.extendedProps.barangayId || currentUser.barangayId,
    } as EventData;
    console.log("event data", eventData)
    createAppointment.mutate(eventData, {
      onSuccess(data, variables, context) {
        console.log(data);
        toast({
          title: "Appointment has been added",
        });
      },
      onError(error: any, variables, context) {
        console.error(error.response.data.message);
        toast({
          title: error.response.data.message,
          variant: "destructive",
        });
      },
    });
  };

  const isDateWithinEvents = (
    dateStart: Date,
    dateEnd: Date,
    eventsArray: typeof currentworkSchedules
  ) => {
    return eventsArray.some((event) => {
      const eventStartDate = new Date(event?.start!);
      const eventEndDate = new Date(event?.end!);
      eventEndDate.setDate(eventEndDate.getDate() + 1);
      if(event.allDay) {
        return dateStart >= eventStartDate && dateEnd <= eventEndDate;
      }
      else {
        const eventStartDateISOS = new Date(event?.start!).toISOString().substring(0,10)
        const eventEndDateISOS = new Date(event?.start!).toISOString().substring(0,10)

        return eventStartDateISOS === dateStart.toISOString().substring(0,10) || eventEndDateISOS === dateStart.toISOString()
      }
      // Check if the dates fall within the event range
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

  return (
    <div className="w-full h-full flex gap-x-3 flex-col md:flex-row">
      <div className="w-full md:flex-[0.8]">
        {
          workSchedules.status === "success"&& <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          dayHeaderClassNames={"text-sky-700 text-sm font-medium uppercase"}
          validRange={{
            start: new Date(),
          }}
          height={"100vh"}
          initialView="dayGridMonth"
          // longPressDelay={0}

          selectAllow={(event) => {
            const isWithinEvents = isDateWithinEvents(
              new Date(event.startStr),
              new Date(event.endStr),
              currentworkSchedules
            );

            // return isWithinEvents

            const dateStart = new Date(event.startStr);
            const dateEnd = new Date(event.endStr);
            console.log(dateStart.toISOString(),
              dateEnd.toISOString())

            // To calculate the time difference of two dates
            const Difference_In_Time = dateEnd.getTime() - dateStart.getTime();

            // To calculate the no. of days between two dates
            const Difference_In_Days = Math.round(
              Difference_In_Time / (1000 * 3600 * 24)
            );

            return Difference_In_Days === 1 && isWithinEvents;
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
          dayCellDidMount={dayCellContent}
          // dayCellContent={dayCellContent}
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
        }
       
      </div>

      {selectInfo && !isMobileOrTablet && (
        <div className=" flex-[0.2] mt-10 flex flex-col h-[80vh] justify-between">
          <h1 className="text-center text-lg font-semibold">Appointments</h1>
          <h2
            className={cn(
              "text-center text-md font-semibold",
              limitExceeded && "text-rose-500"
            )}
          >
            slot: {numberOfAppointments}/{limit}
          </h2>
          <div className="flex flex-col mt-10 max-h-[550px] h-[550px] overflow-y-auto gap-y-2">
            {(() => {
              if (currentAppointment.status === "pending") {
                return (
                  <div className="flex items-center justify-center">
                    <Loader2 size={30} />
                  </div>
                );
              }
              if (currentAppointment.status === "error") {
                return null;
              }
              if (numberOfAppointments <= 0) {
                return (
                  <h1 className="text-center font-semibold">
                    No appointments found
                  </h1>
                );
              }
              return appointments?.map((appointment) => (
                <AppointmentItem
                  data={appointment}
                  currentUser={currentUser}
                  key={appointment.id}
                />
              ));
            })()}
          </div>
          <Button
            className={cn("mx-auto")}
            disabled={limitExceeded}
            onClick={() => {
              if (!limitExceeded) {
                onOpen("addAppointment", {
                  calendarApi: selectInfo,
                  user: currentUser,
                });
              }
            }}
          >
            Add a appointment
          </Button>
        </div>
      )}
    </div>
  );
};

export default Calendar;

const EventContent: React.FC = (eventInfo: any) => {
  const getTime = (date: Date) => {
    const formattedTime = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  };

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

  if (!eventInfo.event.allDay) {

    const dateStart = new Date(eventInfo.event?.startStr);
    const dateEnd = new Date(eventInfo.event?.endStr);

    const formattedStartTime = getTime(dateStart);
    const formattedEndTime = getTime(dateEnd);

    console.log(formattedStartTime, formattedEndTime); // Output: 09:35 PM

    return (
      <div
        className="flex text-sm cursor-pointer gap-x-2 w-full overflow-auto"
        // onClick={() => deleteEvent(eventInfo.event?.id)}
      >
        <Avatar
          className="min-w-10"
          src={eventInfo.event?._def?.extendedProps?.image}
        />
        <div className="flex items-center gap-x-3 flex-col">
          <span>Dr. {eventInfo.event?._def?.extendedProps?.doctorName}</span>
          <span>{eventInfo.event?._def?.extendedProps?.specialist}</span>
          <span>
            {formattedStartTime} - {formattedEndTime}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-x-3 text-sm cursor-pointer overflow-auto"
      // onClick={() => deleteEvent(eventInfo.event?.id)}
    >
      <Avatar
        className="min-w-10"
        src={eventInfo.event?._def?.extendedProps?.image}
      />
      <span>{eventInfo.event?._def?.extendedProps?.doctorName}</span>
      <span>{eventInfo.event?._def?.extendedProps?.specialist}</span>
    </div>
  );
};
