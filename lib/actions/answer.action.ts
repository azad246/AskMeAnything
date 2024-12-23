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
        const questionObject=await Question.findByIdAndUpdate(question,{
            $push:{answers:newAnswer._id}
        })
        await Interaction.create({
            user:author,
            action:"answer",
            question,
            answer:newAnswer._id,
            tags:questionObject.tags
        })
               
        //TODO:add interaction..

        await User.findByIdAndUpdate(author,{
            $inc:{reputation:10}
        })
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw new Error("Error in creating answer");
    }
}


export async function  getAnswers(params:GetAnswersParams){
    try {
        connectToDatabase();
        const {questionId,sortBy,page=1,pageSize=10}=params;
        //  ["highestUpvotes","lowestUpvotes","recent","old]
        
        const skipAmount=(page-1)*pageSize;

        const sortQuery={};
        switch (sortBy) {
            case "highestUpvotes":
                sortQuery["upvotes"]=-1;
                break;
            case "lowestUpvotes":
                sortQuery["upvotes"]=1;
                break;
            case "recent":
                sortQuery["createdAt"]=-1;
                break;
            case "old":
                sortQuery["createdAt"]=1;
                break;
            default:
                break;
        }
        const answers=await Answer.find({question:questionId})
        .populate({path:"author",model:User,select:" _id clerkId name picture"})
        .sort(sortQuery)
        .skip(skipAmount)
        .limit(pageSize);
        const totalAnswers=await Answer.countDocuments({question:questionId});

        const isNext=totalAnswers>skipAmount+answers.length;
        return {answers,isNext};
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
        //increment the author;s reputation
        await User.findByIdAndUpdate(userId,{
            $inc:{reputation:hasupVoted?-2:2}
        })
        await User.findByIdAndUpdate(answer.author,{
            $inc:{reputation:hasupVoted?-10:10}
        })
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
        await User.findByIdAndUpdate(userId,{
            $inc:{reputation:hasdownVoted?2:-2}
        })
        await User.findByIdAndUpdate(answer.author,{
            $inc:{reputation:hasdownVoted?10:-10}
        })
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