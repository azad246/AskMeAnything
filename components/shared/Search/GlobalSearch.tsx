import Image from 'next/image'
import React from 'react'
import { Input } from "@/components/ui/input"


const GlobalSearch = () => {
  return (
    <div className='relative w-full max-w-[600px] max-lg:hidden'>
        <div className='background-light800_darkgradient relative gap-1 flex grow items-center min-h-[56px] rounded-xl px-4 '>
            <Image className='cursor-pointer'
            src={"/assets/icons/search.svg"}
            alt={'search'}
            width={20}
            height={20}/>
            <Input className='paragraph-regular no-focus placeholder outline-none shadow-none text-dark400_light700 border-none' type='text' placeholder='Search globally' />
        </div>
    </div>
  )
}

export default GlobalSearch