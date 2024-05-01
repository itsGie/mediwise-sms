import React from 'react'
import TransactionDetailClient from './components/TransactionDetailClients'
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import { queryFn } from '@/hooks/useTanstackQuery';

const page = async () => {
  const session = await getSession();
  if (!session?.user) {
    return redirect("/");
  }

  return (
    <div>
      <TransactionDetailClient  currentUser={session?.user}/>
    </div>
  )
}

export default page