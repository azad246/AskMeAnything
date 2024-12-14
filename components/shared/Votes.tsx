"use client"
import Image from 'next/image';
import React from 'react'

interface props{
    type:string;
    userId:string;
    itemId:string;
    upvotes:number;
    downvotes:number;
    hasUpVoted:boolean;
    hasDownVoted:boolean;
    hasSaved?:boolean;
}


const  Votes = ({type,userId,itemId,upvotes,downvotes,hasUpVoted,hasSaved,hasDownVoted}:props) => {
  return (
    <div className='flex gap-5'>
        <div className='flex-center gap-2.5'>
            <div className='flex-center gap-1.5'>
                <Image
                src={hasUpVoted?'/assets/icons/upvoted.svg':'/assets/icons/upvote.svg'}
                height={18}
                width={18}
                alt='upvote'
                className='cursor-pointer'
                onClick={()=>{}}
                />
            </div>
        </div> 
    </div>
  )
}

export default  Votes