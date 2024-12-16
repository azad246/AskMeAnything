"use server";

import Answer from "@/Database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/Database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/Database/user.model";
import Interaction from "@/Database/interaction.model";
import Tag from "@/Database/tag.model";

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


export async function upvoteAnswer(params:AnswerVoteParams){
    try {
        connectToDatabase();
        const {answerId,userId,hasupVoted,hasdownVoted,path}=params;

        let updateQuery={};
        if(hasupVoted){
            updateQuery={$pull:{upvotes:userId}}
        }else if(hasdownVoted){
            updateQuery={$pull:{downvotes:userId},$push:{upvotes:userId}}
        }else{
            updateQuery={$addToSet:{upvotes:userId}}
        }
        const answer=await Answer.findByIdAndUpdate(answerId,updateQuery,{new:true});
        if(!answer){
            throw new Error("Answer not Found");
        }
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while fetching Answer');
    }
}


export async function downvoteAnswer(params:AnswerVoteParams){
    try {
        connectToDatabase();
        const {answerId,userId,hasupVoted,hasdownVoted,path}=params;
        let updateQuery={};
        if(hasdownVoted){
            updateQuery={$pull:{downvotes:userId}}
        }else if(hasupVoted){
            updateQuery={$pull:{upvotes:userId},$push:{downvotes:userId}}
        }else{
            updateQuery={$addToSet:{downvotes:userId}}
        }
        const answer=await Answer.findByIdAndUpdate(answerId,updateQuery,{new:true});
        if(!answer){
            throw new Error("Answer not Found");
        }
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while fetching Answer');
    }
}

export async function deleteAnswer(params:DeleteAnswerParams){
    const {answerId,path}=params;
    try {
        connectToDatabase();
        const answer=await Answer.findById(answerId);
        if(!answer){
            throw new Error("Answer not found");
        }
        await Answer.deleteOne({
            _id:answerId
        })
        await Question.updateMany({_id:answer.question},{$pull:{answers:answerId}});

        await Interaction.deleteMany({
            Answer:answerId
        })
        await Tag.updateMany({Answers:answerId},{$pull:{Answers:answerId}});
        revalidatePath(path);
    } catch (error) {
        console.log(error)
    }
}