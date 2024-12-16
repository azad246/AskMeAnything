"use client"
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {  Form,FormControl,FormField, FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProfileSchema } from '@/lib/validations';
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/user.action';




interface params{
    user:string;
    clerkId:string;
}

const Profile = ({user,clerkId}:params) => {
    const editorRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const parsedUser=JSON.parse(user);
    const Router=useRouter();
    const pathName=usePathname();

    const formSchema = ProfileSchema;
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: parsedUser.name || "",
        username:parsedUser.username || "",
        portfolioWebsite:parsedUser.portfolioWebsite || "",
        location:parsedUser.location || "",
        bio:parsedUser.bio || "",
      },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsSubmitting(true);
      try {
        //update the profile actoion
        await updateUser({
          clerkId:clerkId,
          updateData:{
            name:values.name,
            username:values.username,
            portfolioWebsite:values.portfolioWebsite,
            location:values.location,
            bio:values.bio
          },
          path:pathName
        })
        Router.back()
      } catch (error) {
        console.log(error)
      }finally{
        setIsSubmitting(false);
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-9 flex w-full gap-9 flex-col ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className='space-y-3.5'>
                <FormLabel>Name<span className='text-primary-500'>*</span></FormLabel>
                <FormControl>
                  <Input placeholder="your name" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'/>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className='space-y-3.5'>
                <FormLabel>Username<span className='text-primary-500'>*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Your Username" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'/>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className='space-y-3.5'>
                <FormLabel>Portfolio Link<span className='text-primary-500'>*</span></FormLabel>
                <FormControl>
                  <Input type='url' placeholder="Your Portfolio Link" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'/>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className='space-y-3.5'>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Your address" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className='space-y-3.5'>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your Bio" {...field} className='no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'/>
                  
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-7 flex justify-end '>
          <Button disabled={isSubmitting} type="submit" className='primary-gradient w-fit'>
            {isSubmitting?'Saving...':'Save'}
          </Button>
          </div>
        </form>
      </Form>
    )
}

export default Profile