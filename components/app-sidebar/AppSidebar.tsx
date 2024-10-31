"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { sidebarLinks } from "@/constants"
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
  
  export function AppSidebar() {
    const pathName=usePathname();
    return (
      <Sidebar className="top-40">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarLinks.map((item)=>{
                  const isActive=((pathName===item.route) || (pathName.includes(item.route) && item.route.length>1))
                  console.log(isActive);
                  return (
                    <SidebarMenuItem key={item.route}>
                      <Link href={item.route}  className={`${isActive?'primary-gradient text-light-900 rounded-lg':'text-dark300_light900'} flex items-center justify-center gap-2 bg-transparent py-3 px-4`}>
                      <Image src={item.imgURL} alt={'item'} height={20} width={20} className={`${isActive?"":"invert-colors"}`}/>
                      <p className="max-lg:hidden text-sm">{item.label}</p>
                      </Link>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
              <SidebarMenu>
                <div className="top-10 relative">

              <SignedOut>
              <div className='flex flex-col gap-2 justify-center'>
                  <Link href={"/sign-in"}>
                    <Button className='text-lg font-semibold small-medium btn-secondary min-h-[35px] w-full rounded-lg px-4 py-3 shadow-none'>
                      <Image className="lg:hidden" src={'/assets/icons/account.svg'} height={20} width={20} alt="login"/>
                      <span className='max-lg:hidden text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500'> Sign In</span>
                    </Button>
                  </Link>
                  <Link href={"/sign-up"}>
                    <Button className='text-lg text-dark400_light900 font-semibold small-medium light-border-2 btn-tertiary min-h-[35px] w-full rounded-lg px-4 py-3 shadow-none'>
                    <Image className="lg:hidden" src={'/assets/icons/account.svg'} height={20} width={20} alt="login"/>
                      <span className="max-lg:hidden">Sign Up</span>
                    </Button>
                  </Link>
              </div>
            </SignedOut>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }
  