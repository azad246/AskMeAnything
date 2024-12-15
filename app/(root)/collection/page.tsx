import QuestionCard from '@/components/cards/QuestionCard'
import Filter from '@/components/shared/Filter'
import NoResults from '@/components/shared/NoResults'
import LocalSearchBar from '@/components/shared/Search/LocalSearchBar'
import { QuestionFilters } from '@/constants/filters'
import { getSavedQuestions } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'


const Home = async() => {
  const {userId}=auth();
  if(!userId){
    redirect('/sign-in');
  }
  const result=await getSavedQuestions({
    clerkId:userId,
  })
//   console.log(result);

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>
    

    <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
      <LocalSearchBar
      route="/"
      iconPosition="left"
      imgSrc="/assets/icons/search.svg"
      placeHolder="Search for questions"
      otherClasses="flex-1"
      /> 
      <Filter filters={QuestionFilters}
      otherClasses="min-h-[56px] sm:min-w-[170px]"
      />
    </div>
    <div className='mt-10 flex w-full flex-col gap-6'>
      {(result.questions.length>0)?result.questions.map((item)=>(
      <QuestionCard
      _id={item._id}
      key={item._id}
      title={item.title}
      tags={item.tags} 
      views={item.views}
      author={item.author}
      upvotes={item.upvotes}
      answers={item.answers}
      createdAt={item.createdAt}
      />)):(<NoResults
      title="No Questions found!"
      description="No Questions Are Saved"
      link="/ask-questions"
      linkTitle="Ask Question"
      />)}
    </div>
    </>
  )
}

export default Home