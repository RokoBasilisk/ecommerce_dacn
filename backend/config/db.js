import mongoose from "mongoose";

export default async function connectDB() {
  try {
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log(`%cMongoDB Connected: ${conn.connection.host}`, "color:green");
  } catch (error) {
    console.error(`%cError: ${error.message}`, "color:red");
    process.exit(1);
  }
}
