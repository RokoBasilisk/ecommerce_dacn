import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";

import UserModel from "./models/userModel.js";
import ProductModel, { reviewSchema } from "./models/productModel.js";
import OrderModel from "./models/orderModel.js";
import connectDB from "./config/db.js";

// dotenv.config({ path: "./backend/.env" });
dotenv.config();

connectDB();

const importData = async () => {
  try {
    await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();

    const createdUsers = await UserModel.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }));

    for (let product of sampleProducts) {
      let ratingSum = 0;
      let numReviews = 0;
      let i = 2;
      for (let review of product.reviews) {
        ratingSum += Number(review.rating);
        numReviews += 1;
        review.user = createdUsers[i++]._id;
      }
      product.ratingSum = ratingSum;
      product.numReviews = numReviews;
      product.ratingAverage = ratingSum / numReviews;
    }

    await ProductModel.insertMany(sampleProducts);

    console.log("Data imported!");
    process.exit();
  } catch (error) {
    console.error(`Error importing: ${error}`);
    process.exit(1);
  }
};

const purgeData = async () => {
  try {
    await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();

    console.log("Data pruged!");
    process.exit();
  } catch (error) {
    console.error(`Error purging: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d" || process.argv[2] === "-D") purgeData();
else importData();
