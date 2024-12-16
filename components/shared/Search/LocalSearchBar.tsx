"use client";
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

interface customInput{
    route:string,
    iconPosition:string,
    imgSrc:string,
    placeHolder:string,
    otherClasses:string
}
const LocalSearchBar = ({iconPosition,imgSrc,placeHolder,otherClasses}:customInput) => {
  // const router=useRouter();
  // const pathName=usePathname();
  // const searchParams=useSearchParams();

    return (
      <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
        {iconPosition==='left' && <Image src={imgSrc} alt="search_icon" width={24} height={24} className='cursor-pointer' />}
        <Input type='text' placeholder={placeHolder} value="" onChange={()=>{}} className='paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none'/>
        {iconPosition==='right' && <Image src={imgSrc} alt="search_icon" width={24} height={24} className='cursor-pointer' />}

      </div>
  )
}

export default LocalSearchBar