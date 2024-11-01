"use server"

import User from "@/Database/user.model";
import { connectToDatabase } from "../mongoose"

export async function getUserById(params){
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