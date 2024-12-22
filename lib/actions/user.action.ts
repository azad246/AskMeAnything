"use server"
import {FilterQuery} from "mongoose";
import User from "@/Database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/Database/question.model";
import Tag from "@/Database/tag.model";
import Answer from "@/Database/answer.model";

export async function getUserById(params:GetUserByIdParams){
    try{
        connectToDatabase();
        const {userId}=params;
        const user=await User.findOne({clerkId:userId});
        return user;
    }catch(err){
        console.log(err);
        throw err;
    }  
}

export async function createUser(userParam:CreateUserParams){
    try {
        connectToDatabase();
        const newuser=await User.create(userParam)
        return newuser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateUser(userParam:UpdateUserParams){
    try {
        connectToDatabase();
        const {clerkId,updateData,path}=userParam;
        await User.findOneAndUpdate({clerkId},updateData,{new:true});
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(userParam:DeleteUserParams){
    try {
        connectToDatabase();
        const {clerkId}=userParam;
        const user= await User.findOne({clerkId});
        if(!user){
            throw new Error("User not found");
        }
        //delete user froma datavase 
        //get user question ids
        const userQuestionIds=await Question.find({author:user._id}).distinct('_id');
        await Question.deleteMany({author:user._id});

        //delete user answers from
        const deletedUser=await User.findByIdAndDelete(user._id);
        return deletedUser;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllUsers(params:GetAllUsersParams){
    
    try {
        connectToDatabase();
        const {searchQuery,filter,page=1,pageSize=20}=params;
        const skipAmount=(page-1)*pageSize;
   
        const query:FilterQuery<typeof User>={}
        let sortOptions={}
        switch (filter) {
            case "new_users":
                sortOptions={joinedAt:-1}
                break;
            case "new_users":
                sortOptions={joinedAt:-1}
                break;
            case "top_contributors":
                sortOptions={reputation:-1}
                break;
            default:
                break;
        }
        if(searchQuery){
            query.$or=[
                {name:{$regex:new RegExp(searchQuery,'i')}},
                {usename:{$regex:new RegExp(searchQuery,'i')}},
            ]
        }
        const users= await User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);
        const totalUsers=await User.countDocuments(query);
        const isNext=totalUsers>skipAmount+users.length;
        return {users,isNext};
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}

export async function toggleSaveQuestion(params:ToggleSaveQuestionParams){
    const {userId,questionId,path}=params;
    try {
        connectToDatabase();
        const result=await User.findById(userId);
        if(!result){
            throw new Error("User not found");
        }
        const isQuestionSaved=result.saved.includes(questionId);
        let updateQuery={}
        if(isQuestionSaved){
            updateQuery={$pull:{saved:questionId}}
        }else{
            updateQuery={$addToSet:{saved:questionId}}
        }
        await User.findByIdAndUpdate(userId,updateQuery,{new:true});
        revalidatePath(path);
    } catch (error) {
        console.log(error)
    }
}

export async function getSavedQuestions(params:GetSavedQuestionsParams){
    const {clerkId,page=1,pageSize=20,filter,searchQuery}=params;
    const skipAmount=(page-1)*pageSize;

    try {
        connectToDatabase();
        const Query:FilterQuery<typeof Question> = searchQuery?{title:{$regex:new RegExp(searchQuery,'i')}}:{};
        let sortOptions={};
        switch (filter) {
            case "most_recent":
                sortOptions={createdAt:-1}
                break;
            case "oldest":
                sortOptions={createdAt:1}
                break;
            case "most_voted":
                sortOptions={upvotes:1}
                break;
            case "most_viewed":
                sortOptions={views:1}
                break;
            case "most_answered":
                sortOptions={answers: 1}
                break;
            
            default:
                break;
        }
        console.log("filter-" ,filter)
        const user=await User.findOne({clerkId})
        .populate({
            path:'saved',
            match:Query,
            options:{
                sort:sortOptions,
                skip:skipAmount,
                limit:pageSize+1,
            },
        populate:[
            {path:'tags',model:Tag,select:'_id name'}, 
            {path:'author',model:User,select:'_id clerkId name picture'}
        ]
    });

        if(!user){
            throw new Error("User not found");
        }
        const savedQuestion=user.saved;
        const isNext=user.saved.length>pageSize;
        return {questions:savedQuestion,isNext};
    } catch (error) {
        console.log(error);
    }
}


export async function getUserInfo(params:GetUserByIdParams){
    try {
         connectToDatabase();
         const {userId}=params;
        const user=await User.findOne({clerkId:userId});
        const totalQuestions=await Question.countDocuments({author:user._id})
        const totalAnswers=await Answer.countDocuments({author:user._id})
        return {user,totalQuestions,totalAnswers}
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserQuestions(params:GetUserStatsParams){
    try {
        connectToDatabase();
        const {userId,page=1,pageSize=5}=params; 
        const skipAmount=(page-1)*pageSize;
        const totalQuestions=await Question.countDocuments({author:userId})
        const userQuestions=await Question.find({author:userId}).sort({views:-1,upvotes:-1})
        .populate('tags','_id name')
        .populate('author',"_id clerkId name picture")  
        .skip(skipAmount)
        .limit(pageSize) 

        const isNext=totalQuestions>skipAmount+userQuestions.length;
        return {totalQuestions,questions:userQuestions,isNext};
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}
export async function getUserAnswers(params:GetUserStatsParams){
    try {
        connectToDatabase();
        const {userId,page=1,pageSize=10}=params; 
        const skipAmount=(page-1)*pageSize;
        const totalAnswers=await Answer.countDocuments({author:userId})

        const userAnswers=await Answer.find({author:userId}).sort({upvotes:-1})
        .populate('question','_id title')
        .populate('author',"_id clerkId name picture") 
        .skip(skipAmount)
        .limit(pageSize)  

        const isNext=totalAnswers>skipAmount+userAnswers.length;
        
        return {totalAnswers,answers:userAnswers,isNext};
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}
