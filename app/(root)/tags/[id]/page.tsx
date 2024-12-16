import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearchBar from "@/components/shared/Search/LocalSearchBar";
import {  TagFilters } from "@/constants/filters";
import { IQuestion } from "@/Database/question.model";
import { getQuestionsByTag } from "@/lib/actions/tag.action"
import { URLProps } from "@/types";

const page = async({params,searchParams}:URLProps) => {
    const ques=await getQuestionsByTag({
        tagId:params.id,
        page:1,
        searchQuery:searchParams.q
    });
  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>{ques.tagTitle}</h1>
    

    <div className='mt-11 w-full'>
      <LocalSearchBar
      route="/"
      iconPosition="left"
      imgSrc="/assets/icons/search.svg"
      placeHolder="Search tag questions"
      otherClasses="flex-1"
      /> 
      {/* <Filter filters={TagFilters}
      otherClasses="min-h-[56px] sm:min-w-[170px]"
      /> */}
    </div>
    <div className='mt-10 flex w-full flex-col gap-6'>
      {(ques.questions.length>0)?ques.questions.map((item:any)=>(
      <QuestionCard
      key={item._id}
      _id={item._id}
      title={item.title}
      tags={item.tags} 
      views={item.views}
      author={item.author}
      upvotes={item.upvotes}
      answers={item.answers}
      createdAt={item.createdAt}
      />)):(<NoResults
      title="No Tags found!"
      description="There are No Tags questions Found"
      link="/ask-questions"
      linkTitle="Ask Question"
      />)}
    </div>
    </>
  )
}

export default page