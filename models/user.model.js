import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String ,
        required : true ,
        unique : true ,
    },
    name : {
        type : String ,
        required : true ,
    },
    email : {
        type : String ,
        required : true ,
        unique : true ,
        match : [/.+\@.+\..+/ , "Please fill a valid email address"]
    },
    password : {
        type : String , 
        required : true ,
        minlength : 8 ,
    },
    profilePicture : {
        type : String ,
        default : "",
    },
    coverPicture : {
        type : String ,
        default : "",
    },
    location : {
        type : String ,
        default : "Earth",
    },
    skills : [String] ,
    experience : [
        {
            title : String,
            company : String,
            startDate : Date,
            endDate : Date,
            description : String
        }
    ],
    bio : {
        type : String ,
        default : "",
    },
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'User'
        }
    ],
    education : [
        {
            school : String,
            degree : String,
            startYear : Number,
            endYear : Number,
            description : String
        }
    ],
    gender : {
        type : String ,
        enum : ['male','female']
    },
    connections : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'User'
        }
    ],
    lastLogin : {
        type : Date , 
        default : Date.now() 
    }
},{timestamps : true}) ;

export const User = mongoose.model('User',userSchema) ; 