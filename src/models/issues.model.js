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

issueSchema.index({repo : 1, number : 1}, {unique: true})
issueSchema.index({repo : 1, state : 1})

const issueModel = new  mongoose.model("issues", issueSchema);

export {issueModel};