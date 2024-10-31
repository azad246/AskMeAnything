// import LeftSidebar from '@/components/shared/LeftSidebar/LeftSidebar'
import { AppSidebar } from '@/components/app-sidebar/AppSidebar'
import Navbar from '@/components/shared/Navbar/Navbar'
import RightSidebar from '@/components/shared/Search/RightSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='background-light850_dark100 relative flex flex-col'>
        <Navbar/>
        <div className='flex'>
          {/* Leftsidebar */}
            <SidebarProvider>
            <AppSidebar/>
            <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14'>
                <SidebarTrigger className='dark:text-white' />
                <div className='mx-auto w-full max-w-5xl'>
                    {children}
                </div>
            </section>
            </SidebarProvider>
            <RightSidebar/>
        </div>
        Toaster
    </main>
  )
}

export default Layout