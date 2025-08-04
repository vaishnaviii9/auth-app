import mongoose, { connection } from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on('connected',()=>{
        console.log("Mongo DB connected successfully!");
        
    })

    connection.on('error', (err)=>{
        console.log("Mongo DB connection error. Please make sure Mongo DB is running" + err);
        
    })
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}
