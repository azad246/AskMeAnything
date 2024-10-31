import { HomePageFilters } from '@/constants/filters'
import React from 'react'
import { Button } from '../ui/button'

const HomeFilters = () => {
    const isActive="frequent";
  return (
    <div className='mt-10 flex-wrap gap-3 md:flex hidden'>
        {HomePageFilters.map((item) => (
            <Button key={item.value}  className={`body-medium rounded-lg px-6 py-2 text-xs shadow-none capitalize text-light-500 hover:bg-gray-100 ${(isActive===item.value)?"text-primary-500 bg-primary-100 dark:bg-gray-700":"bg-light-800 hover:bg-light-900 text-light-500 dark:hover:bg-gray-700 dark:bg-dark-300"}`}>
                {item.name}
            </Button>
        ))}
    </div>
  )
}

export default HomeFilters