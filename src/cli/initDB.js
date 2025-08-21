import mongoose from "mongoose";
import { repoSchema } from "../Models/repo.model";
import { issueSchema } from "../models/issues.model";

const initDB = () =>{
     repoSchema.index({org : 1, stars : -1});
     repoSchema.index({org : 1, name : 1}, {unique : true});

     issueSchema.index({repo : 1, number : 1}, {unique: true});
     issueSchema.index({repo : 1, state : 1});

     console.log("Indexes created successfully");
}

export {initDB};