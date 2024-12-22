"use client";
import { Button } from '@/components/ui/button'
import { GlobalSearchFilters } from '@/constants/filters'
import { FormUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react';

//1 build out the entire UI/UX forntent
//2 build out the entire UI/UX forntent

// build out the entire UI/UX forntent
//Connect the UI/U

//2nd frontend
// backend


const GlobalFilters = () => {
    const router=useRouter();
    const searchParams=useSearchParams();
    const typeParams=searchParams.get('type');
    const [active, setActive] = useState(typeParams || '')

    const handleTypeClick=(item: string) => {
        if (active === item) {
            setActive('')
            const newurl = FormUrlQuery({
                params: searchParams.toString(),
                key: 'type',
                value: null
            })
            router.push(newurl, { scroll: false })
        } else {
            setActive(item)
            const newurl = FormUrlQuery({
                params: searchParams.toString(),
                key: 'type',
                value: item.toLowerCase()
            })
            router.push(newurl, { scroll: false })
        }

    }
  return (
    <div className='flex items-center gap-5 px-5'>
        <p className='text-dark400_light900 body-medium'>Type: </p>

        <div className='flex-gap-3'>
            {GlobalSearchFilters.map((item)=>(
                <Button onClick={()=>handleTypeClick(item.value)}
                type='button' key={item.value} className={`light-border-2 small-medium rounded-2xl py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 ${active===item.value?'bg-primary-500 text-light-900':'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500'}`}>{item.name}</Button>
            ))}
        </div>
    </div>
  )
}

export default GlobalFilters