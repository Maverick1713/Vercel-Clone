"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const utils_1 = require("./utils");
const file_1 = require("./file");
const path_1 = __importDefault(require("path"));
const aws_1 = require("./aws");
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
publisher.connect();
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
// const definitelyPosix = somePathString.replaceAll(path.sep, path.posix.sep);
// const definitelyWindows = somePathString.replaceAll(path.sep, path.win32.sep);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = (0, utils_1.generate)();
    await (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    const files = (0, file_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    files.forEach(async (file) => {
        // first argument takes the file path from only output/ including file name
        const posixFile = file.replaceAll(path_1.default.sep, path_1.default.posix.sep);
        await (0, aws_1.uploadFile)(posixFile.slice(__dirname.length + 1), file);
    });
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
    res.json({ id: id });
});
app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id);
    res.json({
        status: response
    });
});
app.listen(3000);
