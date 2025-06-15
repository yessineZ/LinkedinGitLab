import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs' ; 
import cloudinary from '../lib/cloudinaryConfig.js' ; 
export const getSuggestedUsers = async (req,res) => {
    try {
    const currentUser = User.find({_id : req.user._id}).select("connections")  ; 
    const users = User.aggregate([
    {
        $match : {
            _id : { $ne : currentUser._id },
            }
    },
    {
        $sample : {
            size : 10 
        }
    }
    ]);

    const filterdUsers = users.filter((user) => !currentUser.connections.includes(user._id)) ;
    filterdUsers.slice(0,4) ; 
    res.json(filterdUsers) ;



    
    res.json(suggestedUsers) ;
    }catch(err) {
        console.log(err.message+" userController") ; 
        res.status(500).json({message : "Server error"}) ;
    }

}


export const getPublicProfile = async (req,res) => {
    try {
             const {username} = req.params  ; 
             const getUserByProfileName = await User.findOne({
                username  
             });
             if(!getUserByProfileName) {
                 return res.status(404).json({message : "User not found"}) ;
             }
             res.json(getUserByProfileName) ;
    }catch(err) {
        console.log(err.message+" userController") ; 
        res.status(500).json({message : "Server error"}) ;
    }
}


export const updateProfile = async (req,res) => {
    try {

        let user = await User.findOne({_id : req.user._id}) ; 
        const {name, headline, profilePicture , experience , education ,about , coverPicture , username , location , password} = req.body ;
        const listOfUserAttributes = [
            "name",
            "headline",
            "username",
            "profilePicture",
            "about",
            "password",
            "coverPicture",
            "location",
            "bio",
            "experience",
            "education",
        ];

        const ExsitingUsername = await User.findOne({ username , _id : { $ne : req.user._id } }) ; 
        if(ExsitingUsername) {
            return res.status(400).json({message : "Username already exists"}) ;
        }
        const checkPassword = await !bcrypt.compare(password,user.password) ;
        if(!checkPassword) return res.status(401).json({message : "Incorrect password"}) ; 
        const attributesShouldBeUpdated = {} ; 

        listOfUserAttributes.forEach((ele) => {
            if(req.body[ele]) {
                attributesShouldBeUpdated[ele] = req.body[ele] ;
            }
        });

        if(profilePicture) {
            if(user.profilePicture) {
                await cloudinary.uploader.destroy(user.profilePicture) ;
            }
            const uploadResponse = await cloudinary.uploader.upload(profilePicture, { folder : "linkedin" }) ;
            attributesShouldBeUpdated.profilePicture = uploadResponse.secure_url ;
        }

        if(coverPicture) {
            if(user.coverPicture) {
                await cloudinary.uploader.destroy(user.coverPicture) ;
            }
            const uploadResponse = await cloudinary.uploader.upload(coverPicture, { folder : "linkedin" }) ;
            attributesShouldBeUpdated.coverPicture = uploadResponse.secure_url ;
        }

         user = await User.findByIdAndUpdate(req.user._id, {$set : attributesShouldBeUpdated}, {new : true}).select('-password') ; 
        if(!user) {
            return res.status(404).json({message : "User not found"}) ;
        }
        res.json(user) ;

    }catch(err) {
        console.log(err.message+" userController") ; 
        res.status(500).json({message : "Server error"}) ;
    }
}