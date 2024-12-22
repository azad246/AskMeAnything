"use client"
import { HomePageFilters } from '@/constants/filters'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation';
import { FormUrlQuery } from '@/lib/utils';

const HomeFilters = () => {
    const searchParams=useSearchParams();
    const router=useRouter();
    const [active, setActive] = useState("");

    const handleClick=(item:string)=>{
          if(active===item){
            setActive('')
            const newurl=FormUrlQuery({
              params:searchParams.toString(),
              key:'filter',
              value:null
            })
            router.push(newurl,{scroll:false})
          }else{
            setActive(item)
            const newurl=FormUrlQuery({
              params:searchParams.toString(),
              key:'filter',
              value:item.toLowerCase()
            })
            router.push(newurl,{scroll:false})
          }
        }
    return (
      <div className='mt-10 flex-wrap gap-3 md:flex hidden'>
        {HomePageFilters.map((item)=>(
          <Button key={item.value} 
          className={`body-medium rounded-lg px-6 py-2 text-xs shadow-none capitalize text-light-500 hover:bg-gray-100 ${active===item.value?"text-primary-500 bg-primary-100 dark:bg-gray-700":"bg-light-800 hover:bg-light-900 text-light-500 dark:hover:bg-gray-700 dark:bg-dark-300"}`} 
         onClick={()=>handleClick(item.value)}
         >
         {item.name}
       </Button>
        ))}
    </div>
    )
}

export default HomeFilters