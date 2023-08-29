import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fname : {
        type : String,
        require : true,
        trim : true
    },
    lname : {
        type : String,
        require : true,
        trim : true
    },
    email : {
        type : String,
        require : true,
        trim : true
    },
    password : {
        type : String,
        require : true,
        trim : true
    },
    referralCode : {
        type : String,
        trim : true
    }
});

export const User = mongoose.model("user",UserSchema);