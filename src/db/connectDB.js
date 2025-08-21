import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        console.log(process.env.MONGODB_URI, process.env.DB_NAME)
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

        if(connection.connections[0].readyState === 1){
            console.log("Connected to MongoDB");
        }

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export {connectDB}