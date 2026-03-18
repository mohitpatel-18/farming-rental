import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Starting without a database connection.");
    return false;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
  return true;
};

export default connectDB;
