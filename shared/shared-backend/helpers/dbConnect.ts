import type { Mongoose } from "mongoose";

export const dbConnect = async (mongoose: Mongoose, mongoURL: string) => {
  try {
    await mongoose.connect(mongoURL);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
