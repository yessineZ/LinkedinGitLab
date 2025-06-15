import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateTokenAndSetCookie } from "../lib/generateTokenAndCookie.js" ;
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs' ; 

export const signUp = async (req,res) => {
        try {
            const { username , name , email , password , gender} = req.body ;
            
            if(!username || !name || !email || !password || !gender) {
                return res.json({message : "All fields are required"}) ;
            }
            const usernameCheck = await User.findOne({ 
                   username 
            });
            
            if(usernameCheck) {
                return res.json({message : "username already exists"}) ;
            }

            const userEmailCheck = await User.findOne({
                email
            });
            if(userEmailCheck) {
                return res.json({message : "email already exists"}) ;
            }

            if(password.length < 6) {
                return res.json({message : "password must be atleast 6 characters long"}) ;
            }

            const hashedPassword = await bcrypt.hash(password,8)  ;

            const newUser = new User({
                username,
                name,
                email,
                password : hashedPassword,
                gender 
            });

            const profileUrl = process.env.CLIENT_URL + "/profile/" + newUser.username  ;

            generateTokenAndSetCookie(res,newUser) ;
            sendWelcomeEmail(newUser.email,newUser.name,profileUrl) ;

            await newUser.save();
            res.json({message : "User registered successfully"}) ;

        
        }catch(err) {
           console.error(err.message+"AUTH CONTROLLER LOGIN") ; 
        }
    }



export const signIn = async (req,res) => {
    try {
        const  {email , password} = req.body ; 
        if(!email || !password) {
            return res.json({message : "All fields are required"}) ;
        }
        const user = await User.findOne({email}) ; 
        if(!user) {
            return res.json({message : "User not found"}) ;
        }

        if(!await bcrypt.compare(password,user.password)) {
            return res.json({message : "Invalid credentials"}) ;
        }

        generateTokenAndSetCookie(res,user) ;
        res.json({message : "User logged in successfully"}) ;
        
    }catch(err) {
        console.err(err.message) ; 
    }
}

export const logout = (req,res) => {
    try {        
        res.clearCookie("token") ;
        res.json({message : "User logged out successfully"}) ;
         
    }catch(err) {
        console.err(err.message) ; 
    }
}





export const getMe = (req,res) => {
    try {
        console.log("gel") ; 
        res.json({user : req.user}) ; 
    }catch(err) {
        console.err(err.message) ;
    }
}




