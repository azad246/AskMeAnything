"use client";
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from './GlobalResult';


const GlobalSearch = () => {
  const router=useRouter();
  const pathName=usePathname();
  const searchParams=useSearchParams();
  const query=searchParams.get('global')
  const [search, setSearch] = useState(query || '')
  const [isopen, setIsOpen] = useState(false)
  const searchContainerRef=useRef(null);

  useEffect(()=>{
    const handleOutSideClick=(event:any)=>{
      if(searchContainerRef.current && !searchContainerRef.current.contains(event.target)){
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('click',handleOutSideClick);
    setIsOpen(false);
    return ()=>{
      document.removeEventListener('click',handleOutSideClick);
    }
  }
  ,[pathName])
  useEffect(()=>{
    const delayDebounceFn=setTimeout(()=>{
      if(search){
        const newurl=FormUrlQuery({
          params:searchParams.toString(),
          key:'global',
          value:search
        })
        router.push(newurl,{scroll:false})
      }else if(query){
        const newurl=removeKeysFromQuery({
          params:searchParams.toString(),
          keysToRemove:['global','type'],
        })
        router.push(newurl,{scroll:false})
      }
    },500);
    return ()=>clearTimeout(delayDebounceFn);
  },[search,router,pathName,query,searchParams])

  
  return (
    <div ref={searchContainerRef} className='relative w-full max-w-[600px] max-lg:hidden'>
        <div className='background-light800_darkgradient relative gap-1 flex grow items-center min-h-[56px] rounded-xl px-4 '>
            <Image className='cursor-pointer'
            src={"/assets/icons/search.svg"}
            alt={'search'}
            width={20}
            height={20}/>
            <Input  
            className='paragraph-regular text-dark400_light700 no-focus placeholder outline-none shadow-none text-dark400_light700 border-none' 
            type='text' 
            placeholder='Search globally'
            value={search}
            onChange={(e)=>{
              setSearch(e.target.value)
              if(!isopen){
                setIsOpen(true);
              }
              if(e.target.value=='' && isopen)setIsOpen(false);
            }}
             />
        </div>
        {isopen && <GlobalResult/>}
    </div>
  )
}

export default GlobalSearch