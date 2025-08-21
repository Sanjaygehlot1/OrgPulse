import mongoose from "mongoose";
import { repoSchema } from "../models/repo.model.js";
import { issueSchema } from "../models/issues.model.js";
import { connectDB } from "../db/connectDB.js";

const initDB = () => {
    connectDB().then(() => {
        repoSchema.index({ org_name: 1, stars: -1 });
        repoSchema.index({ org_name: 1, repo_name: 1 }, { unique: true });

        issueSchema.index({ repo: 1, number: 1 }, { unique: true });
        issueSchema.index({ repo: 1, state: 1 });

        console.log("Indexes created successfully");
    }).catch((error)=>{
        console.log("Error connecting to MongoDB::",error);
    }).finally(()=>{
        process.exit(0);
    })

}

export { initDB };