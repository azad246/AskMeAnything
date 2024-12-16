import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import RenderTag from './RenderTag'
import { getHotQuestons } from '@/lib/actions/question.action'
import { getPopularTags } from '@/lib/actions/tag.action'



const RightSidebar = async() => {
    const hotQuestions=await getHotQuestons()
    const popularTags=await getPopularTags()
    console.log(popularTags)
    // const popularTags=[] 

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
         <div className="">
            <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
            <div className='mt-7 flex w-full flex-col gap-[30px]'>
                {hotQuestions.map((question)=>{
                    return (
                        <Link href={`/questions/${question._id}`} key={question._id} className='flex cursor-pointer items-center justify-betweengap-7'>
                            <p className='body-medium text-dark500_light700'>{question.title}</p>
                            <Image src='/assets/icons/chevron-right.svg' alt='arrow-right' width={20} height={20 }/>
                        </Link>
                    )
                })}
            </div>
         </div>
         <div className='mt-16'>
            <h3 className='h3-bold text-dark200_light900'>Popular tags</h3> 
            <div className='mt-7 flex flex-col gap-4'>
                {popularTags.map((tag)=>(<RenderTag key={tag._id} _id={tag._id} title={tag.name} totalQuestions={tag.numberOfQuestions} showCount/>))}
            </div>
         </div>
    </section>
    )
}

export default RightSidebar