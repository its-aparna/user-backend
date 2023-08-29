import mongoose from "mongoose";
const exInfoSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "user"
    },
    userRefCode:{
        type : String,
        require : true,
    },
    refUserCount : {
        type : Number,
        default : 0
    },
    tokens : {
        type : Number,
        default : 100
    }
});

export const Info = mongoose.model("exInfo",exInfoSchema);