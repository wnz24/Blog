import jwt from "jsonwebtoken";
import {errorHandler} from "./error.js";

export const verifyUser = (req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler('Unauthorized',401))
    }   
    try{
        const user = jwt.verify(token,process.env.JWT_SECRET);
        if(!user){
            return next(errorHandler(401,'Unauthorized'))
        }   
        req.user = user;
        next();
    }catch(error){
        return next(errorHandler(401,'Unauthorized'))
    }   

}