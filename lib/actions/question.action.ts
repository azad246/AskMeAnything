"use server";

import Question from "@/Database/question.model";
import { connectToDatabase } from "../mongoose"
import Tag from "@/Database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/Database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params:GetQuestionsParams){
    try {
        connectToDatabase();
        const questions=await Question.find({})
        .populate({path:'tags',model:Tag})
        .populate({path:'author',model:User})
        .sort({createdAt:-1});
        return {questions};
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while fetching questions');   
    }
}

export async function createQuestion(params:CreateQuestionParams){
    try {
        //connect to a db
        connectToDatabase();
        const {title,content,tags,author,path}=params;
        //create question
        console.log('this statement is being printed in questions.actions.ts')
        const question =await Question.create({title,content,author,path});
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
        revalidatePath(path);
    } catch (error) {
        // donnect to a db 
        console.log('this statement is being printed an error has occurred')
        console.log(error)
    }
}
  