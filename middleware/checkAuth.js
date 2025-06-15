import jwt from 'jsonwebtoken' ; 
import { User } from '../models/user.model.js';

const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies['token'] ; 
        console.log(token) ; 
        if(!token) {
            return res.status(401).json({message : "No token, authorization denied"}) ;
        }
        const verify = jwt.verify(token,process.env.JWT_SECRET) ;

        if(!verify) {
            return res.status(401).json({message : "Unauthorized, token is missing or invalid"}) ;  // 403 Forbidden instead of 401 Unauthorized
        }

        const user = await User.findById(verify.userId).select("-password") ; 
        
        if(user) {
            req.user = user ; 
            next() ;
         }
         else {
            return res.status(401).json({message : "Token is not valid, authorization denied"}) ;
         }
        }catch(e) {
        console.error(e) ;
        return res.status(500).json({message : "Server error"}) ;
    }
}

export default checkAuth ; 