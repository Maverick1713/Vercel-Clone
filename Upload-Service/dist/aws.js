"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
  accessKeyId: "AKIA3FLD2HUV7VL2FLNO",
  secretAccessKey: "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",
});
const uploadFile = async (fileName, localFilePath) => {
  const fileContent = fs_1.default.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "myvercelclone",
      Key: fileName,
    })
    .promise();
  console.log(response);
};
exports.uploadFile = uploadFile;
