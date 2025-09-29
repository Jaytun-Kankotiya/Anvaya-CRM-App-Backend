import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const initializedata = async () => {
  await mongoose
    .connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((error) => console.log("Error connecting database."));
};

// module.exports = {initializedata}
