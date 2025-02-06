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
            { id: validUser._id }, process.env.JWT_SECRET
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


