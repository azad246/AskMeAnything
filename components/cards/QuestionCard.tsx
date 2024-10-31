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
  upvotes:Number,
  views:Number,
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
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        <h3 className='h3-bold text-dark100_light900'>{title}</h3>
        <div className='flex gap-2'>
          {tags.map((tag)=>(
            <span key={tag.id} className='tag'>{tag.name}</span>
          ))}
        </div>
      </div>
      <div className='flex gap-2'>
        <span className='text-dark100_light800'>{author}</span>
        <span className='text-dark100_light800'>{upvotes} upvotes</span>
        <span className='text-dark100_light800'>{views} views</span>
        <span className='text-dark100_light800'>{answers} answers</span>
        <span className='text-dark100_light800'>{createdAt}</span>
      </div>
    </div>
  )
}



export default QuestionCard