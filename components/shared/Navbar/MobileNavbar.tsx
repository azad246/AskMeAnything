"use client";
import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation';

const NavContent=()=>{
    const pathName=usePathname();

    return(
        <section className='flex h-full flex-col pt-16 g-6'>
            {sidebarLinks.map((item)=>{
                const isActive=((pathName===item.route) || (pathName.includes(item.route) && item.route.length>1))
                return (
                    <SheetClose asChild key={item.route}>
                        <Link href={item.route} className={`${isActive?'primary-gradient text-light-900 rounded-lg':'text-dark300_light900'} flex items-center justify-center bg-transparent p-4`}>
                        <Image src={item.imgURL} alt='' height={24} width={24} 
                        className={`${isActive?"":"invert-colors"}`}
                        />
                        <p className={`${isActive?"base-bold":"base-medium"}`}>{item.label}</p>
                        </Link>
                    </SheetClose>
                )
            })}
        </section>
    )
}

const MobileNavbar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image src="/assets/icons/hamburger.svg" alt="side"
                height={36}
                width={36}
                className='invert-colors sm:hidden'
                />
            </SheetTrigger>
            <SheetContent side={'left'} className='background-light900_dark200 border-none'>
                <Link href="/" className="flex items-center gap-1">
                    <Image src="/assets/images/site-logo.svg"
                    alt='site-logo'
                    width={23}
                    height={23} 
                    />
                    <p className='h2-bold text-dark100_light900 font-spaceGrotesk dark:text-light-900'>AskMe<span className='text-primary-500'>Anything</span></p>
                </Link>
                <div>
                    <SheetClose asChild>
                        <NavContent/>
                    </SheetClose>
                    <SignedOut>
                        <div className='flex flex-col gap-3'>
                            <SheetClose asChild>
                                <Link href={"/sign-in"}>
                                <Button className='text-lg font-bold small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500'> Sign In</span>
                                </Button>
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href={"/sign-up"}>
                                <Button className='text-lg text-dark400_light900 font-bold small-medium light-border-2 btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                                    Sign Up
                                </Button>
                                </Link>
                            </SheetClose>
                        </div>
                    </SignedOut>
                </div>
            </SheetContent>
        </Sheet>

    )
}

export default MobileNavbar