import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";
import Checkout from "./models/Checkout.js";

import connectDB from "./config/db.js";
import products from "./data/products.js";

connectDB();

const seedProducts = async () =>{
    try {
        await Product.deleteMany();//deletes all existing products
        await User.deleteMany();//deletes all existing users
        await Cart.deleteMany();//deletes all existing carts
        await Order.deleteMany();//deletes all existing orders
        await Checkout.deleteMany();//deletes all existing checkouts


        // create admin user
        const createdUser= await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:"123456",
            role:"admin"
        })


        const userId=createdUser._id;

        // add admin user to each product
        const sampleProducts =products.map((product)=>(
            {...product,user:userId}
        ))

        await Product.insertMany(sampleProducts);
        console.log("Data Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}


seedProducts();
