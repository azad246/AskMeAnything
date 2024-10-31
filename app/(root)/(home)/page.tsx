import HomeFilters from '@/components/home/HomeFilters'
import QuestionCard from '@/components/cards/QuestionCard'
import Filter from '@/components/shared/Filter'
import NoResults from '@/components/shared/NoResults'
import LocalSearchBar from '@/components/shared/Search/LocalSearchBar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import Link from 'next/link'
import React from 'react'

const questions = [
  {
    id: "q12345",
    title: "How does JavaScript closure work?",
    tags: [
      { id: "t1", name: "JavaScript" },
      { id: "t2", name: "Closures" },
      { id: "t3", name: "Functions" }
    ],
    author: {
      id: "u6789",
      name: "Jane Doe",
      picture: "https://example.com/jane-doe.jpg"
    },
    upvotes: 34,
    views: 1023,
    answers: [
      {
        id: "a1",
        author: { id: "u9876", name: "John Smith", picture: "https://example.com/john-smith.jpg" },
        content: "A closure is the combination of a function bundled together with references to its lexical environment...",
        upvotes: 20,
        createdAt: new Date("2023-09-15T10:30:00")
      }
    ],
    createdAt: new Date("2023-09-10T09:00:00")
  },
  {
    id: "q67890",
    title: "What is the difference between var, let, and const in JavaScript?",
    tags: [
      { id: "t4", name: "JavaScript" },
      { id: "t5", name: "Variables" },
      { id: "t6", name: "ES6" }
    ],
    author: {
      id: "u1234",
      name: "Alice Johnson",
      picture: "https://example.com/alice-johnson.jpg"
    },
    upvotes: 45,
    views: 1523,
    answers: [
      {
        id: "a2",
        author: { id: "u4321", name: "Bob Brown", picture: "https://example.com/bob-brown.jpg" },
        content: "`var` is function-scoped, `let` and `const` are block-scoped. `const` cannot be reassigned...",
        upvotes: 30,
        createdAt: new Date("2023-09-20T12:00:00")
      }
    ],
    createdAt: new Date("2023-09-18T08:30:00")
  },
  {
    id: "q11223",
    title: "How do you optimize a React application for performance?",
    tags: [
      { id: "t7", name: "React" },
      { id: "t8", name: "Performance" },
      { id: "t9", name: "Optimization" }
    ],
    author: {
      id: "u5678",
      name: "Chris Lee",
      picture: "https://example.com/chris-lee.jpg"
    },
    upvotes: 68,
    views: 1820,
    answers: [
      {
        id: "a3",
        author: { id: "u8765", name: "Diana Prince", picture: "https://example.com/diana-prince.jpg" },
        content: "To optimize React apps, you can use techniques like code-splitting, lazy loading, memoization...",
        upvotes: 55,
        createdAt: new Date("2023-09-25T16:45:00")
      }
    ],
    createdAt: new Date("2023-09-22T11:15:00")
  }
];


const Home = () => {
  return (
    <>
    <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center  '>
      <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
      <Link href='/ask-question' className='flex justify-end max-sm:w-full'>
      <Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
        Ask Something..
      </Button>
      </Link>
    </div>
    <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
      <LocalSearchBar
      route="/"
      iconPosition="left"
      imgSrc="/assets/icons/search.svg"
      placeHolder="Search for questions"
      otherClasses="flex-1"
      /> 
      <Filter filters={HomePageFilters}
      otherClasses="min-h-[56px] sm:min-w-[170px]"
      containerClasses="hidden max-md:flex"
      />
    </div>
    <HomeFilters/>
    <div className='mt-10 flex w-full flex-col gap-6'>
      {(questions.length>0)?questions.map((item)=>(<QuestionCard
      key={item.id}
      title={item.title}
      tags={item.tags} 
      author={item.author}
      upvotes={item.upvotes}
      />)):(<NoResults
      title="No Questions found!"
      description="Maybe you can be the first one.."
      link="/ask-questions"
      linkTitle="Ask Question"
      />)}
      
    </div>
    </>
  )
}

export default Home