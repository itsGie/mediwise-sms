import { queryFn } from '@/hooks/useTanstackQuery';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import React from 'react'
import PatientDetailPageClient from './components/PatientDetailPageClient';

type PatientDetailPageProps = {
    params: {
        userId: string;
    };
}

const PatientDetailPage:React.FC<PatientDetailPageProps> = async ({params: {userId}}) => {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users", userId],
    queryFn: () => queryFn({url:`/users/${userId}`}),
  });
    
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <PatientDetailPageClient />        
    </HydrationBoundary>
  )
}

export default PatientDetailPage