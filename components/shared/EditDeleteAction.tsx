"use client"
import { deleteAnswer } from '@/lib/actions/answer.action';
import { deleteQuestion } from '@/lib/actions/question.action';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';


interface props{
    type:string;
    itemId:string;
}

export default function EditDeleteAction({type,itemId}:props) {
    const pathname=usePathname();
    const Router=useRouter()
    const handleEdit=()=>{
        Router.push(`/questions/edit/${JSON.parse(itemId)}`)
    }

    const handleDelete=async()=>{
        if(type==='Question'){
            //delete question
            await deleteQuestion({questionId:JSON.parse(itemId),path:pathname})
        }else if(type==='Answer'){
            //delete answer
            await deleteAnswer({answerId:JSON.parse(itemId),path:pathname})
        }
    }
  return (
    <div className='flex items-center justify_end gap-3 max-sm:w-full '>
        {type=='Question' && (
            <Image
            src={'/assets/icons/edit.svg'}
            alt='Edit'
            height={14}
            width={14}
            className='cursor-pointer object-contain'
            onClick={handleEdit}
        />)}
        <Image
            src={'/assets/icons/trash.svg'}
            alt='Delete'
            height={14}
            width={14}
            className='cursor-pointer object-contain'
            onClick={handleDelete}
        />
    </div>
  )
}
