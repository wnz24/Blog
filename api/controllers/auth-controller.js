import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        next(errorHandler(400, 'All fields are required'))
    }
    const hashPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({ username, email, password: hashPassword });

    try {
        await newUser.save();
        res.json({ message: 'Signup successful' })
    } catch (error) {
        next(error);
    }

}
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
        return next(errorHandler(400, 'All fields are required'))
    }
    const hashPassword = bcryptjs.hashSync(password, 10)

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(400, 'Invalid Username or password'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
           return next(errorHandler(400, 'Invalid Username or password'))
        }
        const token = jwt.sign(
            { id: validUser._id ,isAdmin:validUser.isAdmin }, process.env.JWT_SECRET
        );
        // remove the password from the rest of the user to send back
        const{password: _password, ...user} = validUser._doc

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(user);
    } catch (error) {
        next(error);
    }

}
export const google = async (req,res,next)=>{
    const {email,name,googlePhotoURL} = req.body;
    try {
        const user = await User.findOne({email})
        if(user){
            const token = jwt.sign({id:user._id, isAdmin:user.isAdmin },process.env.JWT_SECRET);
            const {password, ...rest} = user._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly: true,
            }).json(rest);
        }else{
            const generatePassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword,10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password:hashedPassword,
                profilePhoto:googlePhotoURL
                
            })
            await newUser.save()
            const token = jwt.sign({id:newUser._id, isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly: true,
            }).json(rest);
        }

    } catch (error) {
        next(error)
    }
}


