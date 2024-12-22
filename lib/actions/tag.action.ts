"use server";
import User from "@/Database/user.model";
import {FilterQuery} from "mongoose";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITag } from "@/Database/tag.model";
import Question from "@/Database/question.model";

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
        
        const {page=1,pageSize=10,filter,searchQuery}=params;
        const skipAmount=(page-1)*pageSize;
        const query:FilterQuery<typeof Tag>={};

        if(searchQuery){
            query.$or=[
                {name:{$regex:new RegExp(searchQuery,'i')}}
            ]
        }
        let sortQuery={}
        switch (filter) {
            case "popular":
                sortQuery={questions:-1};
                break;
            case "recent":
                sortQuery={createdOn:-1};
                break;
            case "name":
                sortQuery={name:1};
                break;
            case "old":
                sortQuery={createdOn:1}
                break;
            
            default:
                break;
        }
        const totalTags=await Tag.countDocuments(query);
        const tags=await Tag.find(query).sort(sortQuery).skip(skipAmount).limit(pageSize);
        const isNext=totalTags>skipAmount+tags.length;
        return {tags,isNext};
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getQuestionsByTag(params:GetQuestionsByTagIdParams){
    try {
        const {tagId,page=1,pageSize=10,searchQuery}=params;
        await connectToDatabase();
        const tagFilter:FilterQuery<ITag> = {_id:tagId};
        const skipAmount=(page-1)*pageSize;

        const tag=await Tag.findOne(tagFilter)
        .populate({
            path:'questions',
            model:Question,
            match:searchQuery?{title:{$regex:searchQuery,$options:'i'}}:{},
            options:{
               sort:{createdAt:-1},
               skip:skipAmount,
               limit:pageSize+1,   
            },
        populate:[
            {path:'tags',model:Tag,select:'_id name'}, 
            {path:'author',model:User,select:'_id clerkId name picture'}
        ]
    });
        const isNext=tag.questions.length>pageSize;
        if(!tag){
            throw new Error("Tag not found");
        }
        // const Tagquestions=tag.question;

        return {tagTitle:tag.name,questions:tag.questions,isNext};
    } catch (error) {
        console.log(error)
    }
}

export async function getPopularTags(){
    try {
        connectToDatabase();
        const tags=await Tag.aggregate([
            {$project:{
                name:1,
                numberOfQuestions:{$size:'$questions'}}},
            {$sort:{numberOfQuestions:-1}},
            {$limit:5}
        ])
        return tags;
    } catch (error) {
        console.log(error);
        throw error;
    }
}