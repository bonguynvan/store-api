require("dotenv").config();

const connectDB = require("./db/connectdb");

const products = require("./models/products");
const jsonProducts = require("./products.json");
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await products.deleteMany();
    await products.create(jsonProducts);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
