import React from 'react'


interface props{
  id:string,
  title:string,
  tags:{
    id:string,
    name:string
  }[],
  author:{
    id:string,
    name:string,
    picture:string
  },
  upvotes:number,
  views:number,
  answers:Array<object>,
  createdAt:Date
}

const QuestionCard=({
  id, 
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt
}:props)=>{
  return(
    <div className=' card-wrapper p-9 sm:px-11 rounded-[10px]'>
      <div className='flex'>
           
      </div>
      {title}
    </div>
  )
}


export default QuestionCard