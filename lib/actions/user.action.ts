"use server"

import User from "@/Database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/Database/question.model";

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
        // const {page=1,pageSize=20,filter,searchQuery}=params;
        const users= await User.find({}).sort({createdAt:-1});
        return {users};
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}