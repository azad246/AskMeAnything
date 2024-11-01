
import { Schema,models,model,Document } from "mongoose";

export interface IUser extends Document{
    clerkId:string;
    name:string;
    email:string;
    username:string;
    password?:string;
    bio?:string;
    picture:string;
    location?:string;
    portfolioWebsite?:string;
    reputation?:number;
    joinedAt:Date;
}
const UserSchema: Schema = new Schema({
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    bio: { type: String, required: false },
    picture: { type: String, required: true },
    location: { type: String, required: false },
    portfolioWebsite: { type: String, required: false },
    reputation: { type: Number, required: false, default: 0 },
    joinedAt: { type: Date, required: true, default: Date.now },
  });


const User=models.User || model('User',UserSchema)
export default User;