import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePhoto:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
)

const User = mongoose.model('User', UserSchema);

export default User