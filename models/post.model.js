import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' 
    },
    content : {
        type : String 
    },
    image : {
        type : String
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    comments : [
        {
            content : { type : String} ,
            user: { type : mongoose.Schema.Types.ObjectId ,
                ref : 'User'
            },
            createdAt : { type : Date , default : Date.now }
        }
    ]
},{ timestamps : true});

export const Post = mongoose.model('Post',PostSchema) ; 