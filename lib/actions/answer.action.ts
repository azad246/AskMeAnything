"use server";

import Answer from "@/Database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/Database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/Database/user.model";

export async function createAnswer(params:CreateAnswerParams){
    try {
        connectToDatabase();
        const {content,author,question,path}=params;
        const newAnswer=await Answer.create({
            content:content,
            author:author,
            question:question,
            path:path
        });
        //Add the answer to qeustions answer array
        await Question.findByIdAndUpdate(question,{
            $push:{answers:newAnswer._id}
        })
        //TODO:add interaction..
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw new Error("Error in creating answer");
    }
}

export async function  getAnswers(params:GetAnswersParams){
    try {
        connectToDatabase();
        const {questionId}=params;
        const answers=await Answer.find({question:questionId})
        .populate({path:"author",model:User,select:" _id clerkId name picture"})
        .sort({createdAt: -1 });
        return answers;
    } catch (error) {
        console.log(error);
        throw new Error("Error in fetching answers");
    }
}