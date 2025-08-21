import mongoose, { Schema } from "mongoose";

const contributorsSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    contributions: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    url : {
        type : String,
        required : true
    },
    repo_name: {
        type: String,
        required: true
    },
    org_name: {
        type: String,
        required: true
    }
})


const contributorsModel = new mongoose.model("Contributors", contributorsSchema);

export {contributorsModel}