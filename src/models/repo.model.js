import mongoose, { Schema } from "mongoose";

const repoSchema = new Schema({
    org_name: {
        type: String,
        required: true
    },
    repo_name : {
        type: String,
        required : true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    language: {
        type: String
    },
    forks: {
        type: Number
    },
    openIssues: {
        type: Number
    },
    license: {
        key: String,
        name: String,
        spdx_id: String,
        url: String,
        node_id: String
    },
    stars: {
        type: Number
    },
    topics: {
        type: [String]
    },
    pushedAt: {
        type: Date,
        required: true
    }

})




const repoModel = new mongoose.model("repo", repoSchema);


export {repoModel, repoSchema}