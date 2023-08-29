import express from "express";
import dbConfig from "./model/dbConfig.js";
import userRouter from "./route/user.route.js"
import bodyParser from "body-parser";
import cors from "cors"

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/user",userRouter);

app.listen(3000,()=>{
    console.log("Server started .........");
})