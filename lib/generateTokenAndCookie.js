import jwt from 'jsonwebtoken' ; 
export const generateTokenAndSetCookie = (res,user) =>  {
    console.log("i am doing it") ; 
    const token = jwt.sign({
        userId : user._id
    },process.env.JWT_SECRET,{
        expiresIn : '1d'
    });

    res.cookie('token',token,{
        expires : new Date(Date.now() + 60*60*60*24*1000),
        httpOnly : true ,
        secrue : process.env.NODE_ENV === 'production'   ,
        sameSite : 'lax',
        maxAge : 3 * 60 * 60 * 24 * 1000
    });
    
}