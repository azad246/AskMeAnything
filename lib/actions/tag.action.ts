"use server";
import User from "@/Database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/Database/tag.model";

export async function getTopInteractedTags(params:GetTopInteractedTagsParams){
    try {
        connectToDatabase();
        const {userId,}=params;
        const users=await User.findById(userId);
        if(!users){
            throw new Error("User not found");
        }
        //find interactions of users and group by tags
        return [{_id:'1',title:"tag1"},{_id:'2',title:"tag2"}];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllTags(params:GetAllTagsParams){
    try {
        connectToDatabase();
        //find all tags;
        // const {page,pageSize,filter,searchQuery}=params;
        const tags=Tag.find({});
        return tags;
    } catch (error) {
        console.log(error);
        throw error;
    }
}