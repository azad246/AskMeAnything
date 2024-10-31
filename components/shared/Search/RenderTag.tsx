import Link from 'next/link'
import React from 'react'
import { Badge } from "@/components/ui/badge"

interface childrenRender{
  id:number,
  title:string,
  totalQuestions?:number,
  showCount?:boolean
}

const RenderTag = ({id,title,totalQuestions,showCount}:childrenRender) => {
  return (
    <Link href={`/tags/${id}`} className='flex cursor-pointer items-center justify-between gap-2'>
      <Badge className='text-[10px] font-semibold background-light800_dark300 text-light400_light500 px-4 py-2 uppercase rounded'>{title}</Badge>
      <p className='small-medium text-dark500_light700'>{showCount?` - ${totalQuestions}`:""}</p>
    </Link>
  )
}

export default RenderTag