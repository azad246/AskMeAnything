"use server";
import Question from "@/Database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/Database/interaction.model";

export async function viewQuestion(params:ViewQuestionParams){
    await connectToDatabase();
    try {
        const {questionId,userId} = params;
        await Question.findByIdAndUpdate(questionId,{$inc:{views:1}},{new:true});
        if(userId){
            const existingInteraction=await Interaction.findOne({
                user:userId,
                question:questionId,
                action:'view'
            })
            if(existingInteraction){
                return console.log('Interaction already exists');
            }
            await Interaction.create({
                user:userId,
                question:questionId,
                action:'view'
            })
        }
    } catch (error) {
        
    }
}