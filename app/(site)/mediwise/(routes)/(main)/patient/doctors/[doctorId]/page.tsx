import { queryFn } from '@/hooks/useTanstackQuery';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import React from 'react'
import DoctorDetailPageClient from './components/DoctorDetailPageClient';

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
        <DoctorDetailPageClient />        
    </HydrationBoundary>
  )
}

export default PatientDetailPage