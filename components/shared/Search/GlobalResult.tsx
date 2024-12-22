"use client"
import { ReloadIcon } from "@radix-ui/react-icons"
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

const GlobalResult = () => {

    const SearchParams=useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [result,setResult]=useState([]);
    const global=SearchParams.get('global');
    const type=SearchParams.get('type');
   
    useEffect(() => { 
      const fetchresults=async()=>{
        setResult([]);
        setIsLoading(true);
      
      try {
        //everything everywhere all at once...
        const res=await globalSearch({query:global,type:type});
        setResult(JSON.parse(res))

      } catch (error) {
        console.log(error)
        throw new Error('Error fetching results')
      }finally{
        setIsLoading(false);
      }
    }
    if(global){
      fetchresults();
    }
    }, [global,type])
    const renderLink=(type:string,id:string)=>{
        switch (type) {
          case 'question':
            return `/questions/${id}`
            break;
            case 'answer':
              return `/questions/${id}`
            break;
            case 'user':
            return `/profile/${id}`
            break;
            case 'tag':
            return `/tags/${id}`
            break;
          default:
            return '/'
            break;
        }
    }
  return (
    <div  className="absolute top-full z-10 mt-3 w-full bg-light-800 py-5 shadows-sm dark:bg-dark-400 rounded-xl">
        <p className="text-dark400_light900 paragraph-semibold px-5">
            <GlobalFilters
            />
        </p>
        <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50">

        </div>
        <div className="space-y-5 ">
            <p className="text-dark400_light900 paragraph-semibold px-5">
                Top match
            </p>
            {isLoading?(
                <div className="flex-center flex-col px-5">
                    <ReloadIcon className="my-2 h-10 w-10 text-primary-500 animate-spin"/>
                    <p className="text-dark200_light800 body-regular">Browsing the entire database</p>
                </div>
            ):<div className="flex flex-col gap-2">
                {result.length>0?result.map((item:any,index:number)=>(
                            <Link 
                            key={item.type+item.id+index}
                            href={renderLink(item.type,item.id)}
                            className="flex w-full cursor-pointer item-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50">

                                <Image
                                src={"/assets/icons/tag.svg"}
                                alt={'tag'}
                                width={18}
                                height={18}
                                className="mt-1 invert-colors object-contain"
                                />
                                <div className="flex flex-col">
                                    <p className="body-medium text-dark200_light800 line-clamp">{item.title}</p>
                                    <p className="text-light400_light500 mt-1 small-medium font-capitalize">{item.type}</p>
                                </div>
                            </Link>
                ))
                    :(
                    <p className=" flex-center flex-col text-dark200_light800 body-regular px-5 py-2.5">No results found</p>
                )
                }
               </div>
            }
        </div>
    </div>
  ) 
}

export default GlobalResult