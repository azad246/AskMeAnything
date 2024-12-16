"use client";
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { QuestionsSchema } from '@/lib/validations';
import * as z from 'zod';
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion, EditQuestion } from '@/lib/actions/question.action';
import {usePathname, useRouter} from 'next/navigation'
import { useTheme } from '@/app/context/ThemeProvider';

interface Props{
  mongoUserId:string;
  type:string;
  questionDetails?:string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// type Formtype='create'|'Edit';
// const type:Formtype='create'

const Questions = ({mongoUserId,type,questionDetails}:Props) => {
  const {mode}=useTheme();
  const editorRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router=useRouter();
  const pathName=usePathname();

  const parsedDetails=questionDetails?JSON.parse(questionDetails):{};

  const groupedTags=parsedDetails.tags.map((tag)=>tag.name)
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedDetails.title || '',
      explanation:parsedDetails.content || '',
      tags: groupedTags || [] 
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);
    
    try {
      if(type==='Edit'){
        await EditQuestion({
          questionId:parsedDetails._id,
          title:values.title,
          content:values.explanation,  
          path:pathName
          });
        router.push(`/questions/${parsedDetails._id}`);
      }else{
        await createQuestion({
          title:values.title,
          content:values.explanation,
          tags:values.tags,
          author:JSON.parse(mongoUserId),   
          path:pathName,  
          });
          router.push('/');
      }

    } catch (error) {
      console.log("error has come! \n\n\n")
      console.log(error);
    }finally{
      setIsSubmitting(false);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if(tagValue !== '') {
        if(tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters.'
          })
        }

        if(!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = ''
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const handleTagRemove=(tag:string,field:any)=>{
    const newTags=field.value.filter((tag:string)=>tag!=tag)
    form.setValue('tags',newTags)
  }

  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-10">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Question Title<span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
                <Input className='no-focus paragraph-regular text-dark300_light700 background-light900_dark300 light-border-2 border min-h-[56px]' placeholder="" {...field} />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Be specific about questions.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Question Title<span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
                {/* formeditor  */}
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYKEY}
                  onInit={(_evt, editor) => {
                    //@ts-ignore
                    editorRef.current = editor ;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content)=>field.onChange(content)}
                  initialValue={parsedDetails.content || ''}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                      'insertdatetime', 'media', 'table'],
                    toolbar: 'undo redo |  ' +
                      'codesample bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent',
                    content_style: 'body { font-family:Inter; font-size:16px }',
                    skin:(mode==='dark')?'oxide-dark':'oxide',
                    content_css:(mode==='dark')?'dark':'light' 
                  }}
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({field}) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Tags<span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
                <>
                <Input 
                disabled={(type==='Edit')}
                className='no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 border min-h-[56px]' 
                placeholder="Add Tags."
                onKeyDown={(e)=>handleInputKeyDown(e,field)}/>
                 {field.value.length > 0 && (
                  <div className="flex-start mt-2.5 gap-2.5">
                     
                    {field.value.map((tag: any) => ( 
                      <Badge key={tag} className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize" 
                      >
                        {tag}
                        {type! =='create' && <Image 
                          src="/assets/icons/close.svg"
                          alt="Close icon"
                          width={12}
                          height={12}
                          className="cursor-pointer object-contain invert-0 dark:invert"
                          onClick={()=>type==="create"?handleTagRemove(tag, field):()=>{}}
                        />}
                      </Badge>
                    ))}
                  </div>
                )}
                
              
              </>
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Add upto 3 tags that describe the question.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        
        <Button type="submit" className='primary-gradient w-fit !text-light-900' disabled={isSubmitting}>
          {isSubmitting? (
            <>
             {type==='Edit'?'Editing...':'Posting...'}
            </>
          ):(
          <>
            {type==='Edit'?'Edit Questions':'Ask a Question'}
          </>
        )}  
          </Button>
      </form>
    </Form>
  )
}

export default Questions