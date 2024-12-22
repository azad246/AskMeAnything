"use server";

import Question from "@/Database/question.model";
import { connectToDatabase } from "../mongoose"
import { FilterQuery } from "mongoose";
import Tag from "@/Database/tag.model";
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetAllUsersParams, GetQuestionByIdParams, GetQuestionsParams, GetUserByIdParams, QuestionVoteParams } from "./shared.types";
import User from "@/Database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/Database/answer.model";
import Interaction from "@/Database/interaction.model";

export async function getQuestions(params:GetQuestionsParams){
    
    try {
        connectToDatabase();
        const {searchQuery,filter,page=1,pageSize=20}=params;
        
        //calcualte the number of posts to skip based on the page
        const skipAmount=(page-1)*pageSize;
        const query:FilterQuery<typeof Question>={}; 
        if(searchQuery){
            query.$or=[
                {title:{$regex:new RegExp(searchQuery,'i')}},
                {content:{$regex:new RegExp(searchQuery,'i')}},

            ]
        }
        let sortOption={}
        switch (filter) {
            case "newest":
                sortOption={createdAt:-1};
                break;
            case "frequent":
                sortOption={views:-1}
            break;
            case "unanswered":
                query.answers={$size:0}
            break;
            default:
                break;
        }

        const questions=await Question.find(query)
        .populate({path:'tags',model:Tag})
        .populate({path:'author',model:User})
        .skip(skipAmount)
        .limit(pageSize)
        .sort(sortOption);
        const totalQuestions=await Question.countDocuments(query);
        const isNext=totalQuestions>skipAmount+questions.length;
        return {questions,isNext};
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
          //interactio reorcord for user'sas asked quesiton
          await Interaction.create({
            user:author,
            action:"ask_question",
            question:question._id,
            tags:tagDocuments
          })
          //increment author's reputation by +5 fr creating a question
          await User.findByIdAndUpdate(author,{
            $inc:{reputation:5}
          })
        revalidatePath(path);
    } catch (error) {
        // donnect to a db 
        console.log(error)
    }
}

export async function getQuestionById(params:GetQuestionByIdParams){
    try {
        connectToDatabase();
        const {questionId}=params;
        const ques=await Question.findById(questionId)
        .populate({path:'tags',model:Tag,select:'_id name'})
        .populate({path:'author',model:User,select:'_id name picture clerkId'});
        
        return ques;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while fetching question');
    }
}

export async function upvoteQuestion(params:QuestionVoteParams){
    try {
        connectToDatabase();
        const {questionId,userId,hasupVoted,hasdownVoted,path}=params;
        let updateQuery={};
        if(hasupVoted){
            updateQuery={$pull:{upvotes:userId}}
        }else if(hasdownVoted){
            updateQuery={$pull:{downvotes:userId},$push:{upvotes:userId}}
        }else{
            updateQuery={$addToSet:{upvotes:userId}}
        }
        const question=await Question.findByIdAndUpdate(questionId,updateQuery,{new:true});
        const user=await User.findByIdAndUpdate(userId,{$inc:{reputation:hasupVoted?1:-1}})

        //increment the author;s reputation
        await User.findByIdAndUpdate(question.author,{
            $inc:{reputation:hasupVoted?10:-10}
        })

        if(!question){
            throw new Error("Question not Found");
        }

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while fetching question');
    }
}

export async function downvoteQuestion(params:QuestionVoteParams){
    try {
        connectToDatabase();
        const {questionId,userId,hasupVoted,hasdownVoted,path}=params;
        let updateQuery={};
        if(hasdownVoted){
            updateQuery={$pull:{downvotes:userId}}
        }else if(hasupVoted){
            updateQuery={$pull:{upvotes:userId},$push:{downvotes:userId}}
        }else{
            updateQuery={$addToSet:{downvotes:userId}}
        }
        const question=await Question.findByIdAndUpdate(questionId,updateQuery,{new:true});
        const user=await User.findByIdAndUpdate(userId,{$inc:{reputation:hasdownVoted?1:-1}})

        //increment the author;s reputation
        await User.findByIdAndUpdate(question.author,{
            $inc:{reputation:hasdownVoted?-10:10}
        })

        if(!question){
            throw new Error("Question not Found");
        }
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while fetching question');
    }
}

export async function deleteQuestion(params:DeleteQuestionParams){
    const {questionId,path}=params;
    try {
        connectToDatabase();
        await Question.deleteOne({
            _id:questionId
        })
        await Answer.deleteMany({
            question:questionId
        })
        await Interaction.deleteMany({
            question:questionId
        })
        await Tag.updateMany({questions:questionId},{$pull:{questions:questionId}});
        revalidatePath(path);
    } catch (error) {
        console.log(error)
    }
}

export async function EditQuestion(params:EditQuestionParams){
    const {questionId,title,content,path}=params;
    try {
        connectToDatabase();
        const question=await Question.findById(questionId).populate("tags");
        if(!question){
            throw new Error("Question not found");
        }
        question.title=title;
        question.content=content;
        await question.save();
        revalidatePath(path);
    } catch (error) {
        console.log(error)
    }
}

export async function getHotQuestons(){
    try {
        connectToDatabase();
        const hotQuestions=await Question.find({}).sort({views:-1,upvotes:-1}).limit(5);
        return hotQuestions;
    } catch (error) {
        console.log(error)
    }
}