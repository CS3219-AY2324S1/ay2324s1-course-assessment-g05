import mongoose from "mongoose";

export async function connectToMongoDb() {
  try {
    mongoose.connect(process.env.CONNECTION_STRING!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Mongo DB is connected successfully.");
    });

    connection.on("error", (err) => {
      console.log(
        "Mongo DB fails to connect, make sure the database is running." + err
      );
      process.exit();
    });
  } catch (error: any) {
    console.log(error);
  }
}
