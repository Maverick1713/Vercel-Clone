import {S3} from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId : "AKIA3FLD2HUV7VL2FLNO",
    secretAccessKey : "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",
})

export const uploadFile = async(fileName:string , localFilePath:string )=>{
    const fileContent = fs.readFileSync(localFilePath);
    const response= await s3.upload({
        Body : fileContent,
        Bucket : "myvercelclone",
        Key:fileName
    }).promise()
    console.log(response)
}