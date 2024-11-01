import mongoose from 'mongoose';

let isConnected:boolean=false;

export const connectToDatabase=async()=>{
    mongoose.set('strictQuery',true);
    if(!process.env.MONGO_URL){
        return new Error('MONGO_URI is not defined');
    }
    if(isConnected){
        console.log('Using existing database connection');
        return;   
    }
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            dbName:'AskMeAnything',
        })
        isConnected=true;
        console.log('Connected to Database'); 
    } catch (error) {
        console.log(error,'Not Connected')   
    }
}
