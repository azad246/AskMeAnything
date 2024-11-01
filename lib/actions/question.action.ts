"use server";

import Question from "@/Database/question.model";
import { connectToDatabase } from "../mongoose"
import Tag from "@/Database/tag.model";

export async function createQuestion(params:any){
    try {
        //connect to a db
        connectToDatabase();
        const {title,content,tags,author}=params;
        //create question
        console.log('this statement is being printed in questions.actions.ts')
        const question =await Question.create({title,content,author});
        const tagDocuments=[];
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
              { name: { $regex: new RegExp(`^${tag}$`, "i") } }, 
              { $setOnInsert: { name: tag }, $push: { questions: question._id } },
              { upsert: true, new: true }
            )
            if(existingTag && existingTag._id){
                tagDocuments.push(existingTag._id);
            }else{
                console.error("No tag found")
            }
          }

        await Question.findByIdAndUpdate(question._id,{
            $push: { tags: { $each: tagDocuments }}
          });
    } catch (error) {
        // donnect to a db 
        console.log('this statement is being printed an error has occurred')
        console.log(error)
    }
}
  