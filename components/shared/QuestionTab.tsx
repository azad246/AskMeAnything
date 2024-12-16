import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types"
import QuestionCard from "../cards/QuestionCard";
import { ReactNode } from "react";


interface props extends SearchParamsProps{
    userId:string;
    clerkId?:string | null;
}

const QuestionTab = async({searchParams,userId,clerkId}:props) => {
  const result=await getUserQuestions({
    userId,
    page:1,
  });
  return(
  <> 
    {result?.questions.map((question):ReactNode=>{
      return(
         <QuestionCard
         _id={question._id}
         key={question._id}
         clerkId={clerkId}
         title={question.title}
         tags={question.tags} 
         views={question.views}
         author={question.author}
         upvotes={question.upvotes}
         answers={question.answers.length}
         createdAt={question.createdAt}
         />)
    })}
    </>)
}

export default QuestionTab