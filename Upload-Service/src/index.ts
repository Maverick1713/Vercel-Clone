import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import {createClient} from "redis";
const publisher = createClient();
publisher.connect();
const subscriber = createClient();
subscriber.connect();

// const definitelyPosix = somePathString.replaceAll(path.sep, path.posix.sep);
// const definitelyWindows = somePathString.replaceAll(path.sep, path.win32.sep);


const app = express();
app.use(cors());
app.use(express.json())


app.post("/deploy",async(req,res)=>{
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl); 
    const id = generate()
    await simpleGit().clone(repoUrl,path.join(__dirname, `output/${id}`))
    const files = getAllFiles(path.join(__dirname,`output/${id}`));
    files.forEach(async file =>{
        // first argument takes the file path from only output/ including file name
        const posixFile = file.replaceAll(path.sep, path.posix.sep);
        await uploadFile(posixFile.slice(__dirname.length+1),file)  
    })
    publisher.lPush("build-queue", id);
    publisher.hSet("status",id,"uploaded");

    res.json({id:id});
})

app.get("/status",async (req,res)=>{
    const id = req.query.id;
    const response = await subscriber.hGet("status",id as string);
    res.json({
        status:response
    })
})


app.listen(3000);