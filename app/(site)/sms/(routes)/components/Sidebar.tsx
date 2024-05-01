import React from 'react'
import { Logo } from './Logo'
import { SidebarRoutes } from './SidebarRoutes'
import { getSession } from '@/lib/auth'
import { Session, User } from 'next-auth';

type SidebarProps = {
  currentUser: Session['user'] | null;
};

const Sidebar:React.FC<SidebarProps> = async ({currentUser}) => {

  return (
    <nav className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm dark:bg-[#020817] dark:text-white">
      <div className="p-6 flex items-center justify-center">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes role={currentUser?.role} />
      </div>
    </nav>
  )
}

export default Sidebar