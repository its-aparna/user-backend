import mongoose from "mongoose";

mongoose.connect("mongodb+srv://AparnaNarvariya:devdev2012@cluster0.wuuxsqv.mongodb.net/try")
.then(()=>{
    console.log("Database connected.......");
}).catch((err)=>{
    console.log("Database not connected",err);
})

export default mongoose.connection;