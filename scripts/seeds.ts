import mongoose from "mongoose";
import Field from "../models/field.model";

const mongoURI =
  process.env.MONGO_DB_URL ||
    "mongodb+srv://hieunm1:hieunm98@mycloud.xwhohwz.mongodb.net/?retryWrites=true&w=majority&appName=Mycloud";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");

    const fields = [
      {
        ID: 1,
        name: "Sân 5",
        quantity: 5,
        bookedQuantity: 4,
      },
      {
        ID: 2,
        name: "Sân 7",
        quantity: 2,
        bookedQuantity: 2,
      },
      {
        ID: 3,
        name: "Sân 11",
        quantity: 2,
        bookedQuantity: 1,
      },
    ];

    return Field.deleteMany()
      .then(() => Field.insertMany(fields))
      .then(() => {
        console.log("Database seeded!");
        return mongoose.connection.close();
      });
  })
  .catch((error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error connecting to MongoDB:", errorMessage);
  });
