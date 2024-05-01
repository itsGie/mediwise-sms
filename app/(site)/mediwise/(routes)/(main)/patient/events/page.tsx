import React from 'react'
import EventsClient from './components/EventsClient'
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/service/user';
import { queryFn } from '@/hooks/useTanstackQuery';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

const EventsPage = async () => {

  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }
  
  const currentUser = await getUserById({id: session.user.id})

  if (!currentUser) {
    return redirect("/");
  }
  
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["events", 'barangay', session.user.barangayId],
    queryFn: () =>
      queryFn({
        url: "/events",
        queryParams: {
          barangayId: session.user.barangayId
        }
      }),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EventsClient currentUser={currentUser}/>
      </HydrationBoundary>
    </div>
  )
}

export default EventsPage