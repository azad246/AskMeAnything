import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';
import Metric from '@/components/shared/Search/Metric';
import ParseHTML from '@/components/shared/Search/ParseHTML';
import RenderTag from '@/components/shared/Search/RenderTag';
import Votes from '@/components/shared/Votes';
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import { URLProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Page = async({params,searchParams}:URLProps)=> {
  const {userId:clerkId}=auth();
  let mongoUser=null;
  if(clerkId){
    mongoUser=await getUserById({userId:clerkId})
  }
  

  const result=await getQuestionById({
    questionId:params.id,
  });
  
  return (
   <>
   <div className='flex flex-col flex-start w-full'>
    <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
      <Link href={`/profile/${result.author.clerkId}`} className='flex items-center justify-center gap-1' >
      <Image src={result.author.picture} alt='profile'
      height={22} width={22}
      className='rounded-full'
      />
      <p className='paragraph-semibold text-dark300_light700'>{result.author.name}</p>
      </Link>
      <div className='flex justify-end'>
        <Votes
        type="Question"
        itemId={JSON.stringify(result._id)}
        userId={JSON.stringify(mongoUser._id)}
        upvotes={result.upvotes.length}
        downvotes={result.downvotes.length}
        hasUpVoted={result.upvotes.includes(mongoUser._id)} 
        hasDownVoted={result.downvotes.includes(mongoUser._id)}
        hasSaved={mongoUser?.saved.includes(result._id)}
        />
      </div>
    </div>
    <h2 className='h2-semibold text-dark200_light800 mt-3.5 w-full text-left'>
      {result.title}
    </h2>
   </div>
   <div className='mb-8 mt-5 flex flex-wrap gap-4'>
   <Metric
        imgUrl="/assets/icons/clock.svg"
        alt="Clock icon"
        value={`asked ${getTimestamp(result.createdAt)}`}
        title="Asked"
        textStyles="small-medium text-dark400_light800"
        />
        <Metric
        imgUrl="/assets/icons/message.svg"
        alt="message"
        value={formatAndDivideNumber(result.answers.length)}
        title="Answers"
        textStyles="small-medium text-dark400_light800"
        />
        <Metric
        imgUrl="/assets/icons/eye.svg"
        alt="eye"
        value={formatAndDivideNumber(result.views)}
        title="Views"
        textStyles="small-medium text-dark400_light800"
        />
   </div>
   <ParseHTML data={result.content}/>
   <div className='mt-8 flex flex-wrap gap' >
    {result.tags.map((tag:any)=>{
       return <RenderTag key={tag._id} _id={tag._id} title={tag.name} showCount={false}/>
    })}
   </div>
   <AllAnswers
    questionId={result._id}
    userId={mongoUser._id}
    totalAnswers={result.answers.length}
    filter={(searchParams.filter?searchParams.filter:"recent")}
    page={Number(searchParams.page?searchParams.page:'1')}
   />
   <Answer question={result.content} authorId={JSON.stringify(mongoUser._id)} questionId={JSON.stringify(result._id)} />
   </>
  )
}

export default Page