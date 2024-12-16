"use client";
import { Input } from '@/components/ui/input'
import { FormUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface customInput{
    route:string,
    iconPosition:string,
    imgSrc:string,
    placeHolder:string,
    otherClasses:string
}
const LocalSearchBar = ({iconPosition,imgSrc,placeHolder,otherClasses,route}:customInput) => {
  const router=useRouter();
  const pathName=usePathname();
  const searchParams=useSearchParams();
  const query=searchParams.get('q')
  const [search, setSearch] = useState(query || '')

  useEffect(()=>{
    const delayDebounceFn=setTimeout(()=>{
      if(search){
        const newurl=FormUrlQuery({
          params:searchParams.toString(),
          key:'q',
          value:search
        })
        router.push(newurl,{scroll:false})
      }else if(route===pathName){
        const newurl=removeKeysFromQuery({
          params:searchParams.toString(),
          keysToRemove:['q'],
        })
        router.push(newurl,{scroll:false})
      }
    },500);
    return ()=>clearTimeout(delayDebounceFn);
  },[search,router,pathName,query,searchParams])

    return (
      <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
        {iconPosition==='left' && <Image src={imgSrc} alt="search_icon" width={24} height={24} className='cursor-pointer' />}
        <Input type='text' placeholder={placeHolder} value={search} onChange={(e)=>setSearch(e.target.value)} className='paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none'/>
        {iconPosition==='right' && <Image src={imgSrc} alt="search_icon" width={24} height={24} className='cursor-pointer' />}

      </div>
  )
}

export default LocalSearchBar