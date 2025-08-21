import mongoose, {Schema} from "mongoose";

const issueSchema = new Schema({
    repo : {
        type : String,
        required : true
    },
    number :{
        type : Number,
        required : true
    },
    state : {
        type : String,
    },
    createdAt: {
        type : Date,
        required : true
    },
    title : {
        type : String,
        required : true
    }
}) 

const issueModel = new  mongoose.model("issues", issueSchema);

export {issueModel, issueSchema};