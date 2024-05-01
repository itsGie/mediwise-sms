"use client";
import React from "react";
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
import { Role, WorkSchedule } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "next-auth";

type CalendarClientProps = {
  currentUser: Session['user']
}

const Calendar:React.FC<CalendarClientProps> = ({currentUser}) => {
  const { onOpen, onClose } = useModal();
  const {toast} = useToast()
  const workSchedules = useQueryProcessor<WorkSchedule[]>({url:`/work-schedules`,key:["work-schedules"], queryParams: {
    userId: currentUser.id
  }});

  const currentworkSchedules = typeof workSchedules.data !== "undefined" && workSchedules?.data?.length > 0
      ? workSchedules.data.map((workSchedule) => {
          return {
            id: workSchedule?.id,
            title: workSchedule?.title,
            start: workSchedule?.start,
            end: workSchedule?.end,
            allDay: workSchedule?.allDay,
          };
        })
      : [];


  const handleDateSelect = (selectInfo: any) => {
    const calendarApi = selectInfo;
    console.log(calendarApi)
    onOpen("addWorkSchedule", { calendarApi, user: currentUser });
  };

  type EventData = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
  };
  
  const addWorkSchedule = useMutateProcessor({
    url: '/work-schedules',
    method:'POST',
    key: ['work-schedules']
  })

  const handleAddEvent = ({ event }: any) => {
    const eventData = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      barangayId: event?._def?.extendedProps?.barangayId
    } as EventData;

    addWorkSchedule.mutate(eventData, {
      onSuccess(data) {
        toast({
          title: "Schedule added",
          description: "Your work schedule has been added",
        })
        onClose();
      },
      onError(error, variables, context) {
        console.error(error)
        toast({
          variant:'destructive',
          title: "Something went wrong",
          description: "Your work schedule did save",
        })
      },
    });
  };

  const updateEvent = async (
    workScheduleId: string,
    data: Omit<EventData, "description">
  ) => {
    try {
      await apiClient.patch(`/socket/work-schedules/${workScheduleId}`, data);
    } catch (error) {
      console.error("error update");
    } finally {
      queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
    }
  };
  const queryClient = useQueryClient();
  const handleUpdateEvent = ({ event }: any) => {

    const eventData = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
    };

    updateEvent(event.id, eventData);

  };

  const deleteEvent = async (eventId: string) => {
    try {
      await apiClient.delete(`/work-schedules/${eventId}`);
      toast({title:"Event deleted"});
    } catch (error) {
      console.error("error delete event");
      toast({title:"Event did not delete", variant: 'destructive'});
    } finally {
      queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
    }
  };


  const handleEventClick = (calendarApi: any) => {
    onOpen("deleteEvent", { calendarApi });
  };

  const handleDeleteEvent = ({ event }: any) => {
    console.log("deleting event");
    console.log(event)
    deleteEvent(event.id);
  };

  const disabledTimes = [
    '09:00', '10:30', '14:00' // Example disabled times
  ];
  
  const isTimeDisabled = (time:any) => {
    console.log('hello')
    return disabledTimes.includes(time);
  };

  return (
    <div className="w-full h-full">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
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
        editable={true}
        selectable={true}
        selectMirror={true}
        droppable={true}
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

        dayMaxEvents={true}
        
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
  );
};

export default Calendar;
