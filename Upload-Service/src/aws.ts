import {S3} from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId : "AKIA3FLD2HUVXWZYT72I",
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