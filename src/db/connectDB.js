import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);

        if(connection.connections[0].readyState === 1){
            console.log("Connected to MongoDB");
        }

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export {connectDB}