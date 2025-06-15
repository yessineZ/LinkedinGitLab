import mongoose from "mongoose";


const notifModel = new mongoose.Schema({
    recipient : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true
    },
    type : {
        type : String ,
        required : true,
        enum : ['like','comment','follow','unlike','connectionAccepted','connectionRequestRejected'] 
    },
    relatedUser : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    },
    relatedPost : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Post'
    },
    read : {
        type : Boolean ,
        default : false
    }
},{ timestamps : true});


export const Notification = mongoose.model('Notification',notifModel) ;
