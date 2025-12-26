import express from "express";
import razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import connectDB from "./config/db.js";
import UserRoutes from "./Routes/UserRoutes.js"
import router from "./Routes/UserRoutes.js";
import ProductRoutes from "./Routes/ProductRoutes.js"
import CartRoutes from "./Routes/CartRoutes.js"
import CheckoutRoutes from "./Routes/CheckoutRoutes.js"
import OrderRoutes from "./Routes/OrderRoutes.js"
import UploadRoutes from "./Routes/UploadRoutes.js"
import SubscriberRoutes from "./Routes/SubscriberRoutes.js"
import AdminRoutes from "./Routes/AdminRoutes.js"
import ProductAdminRoutes from "./Routes/ProductAdminRoutes.js"
import AdminOrderRoutes from "./Routes/AdminOrderRoutes.js"

dotenv.config();
dotenv.config({ quiet: true });

console.log(process.env.PORT)

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  await connectDB();
  next(); // Continue to the actual route
});





//All api routes
app.use("/api/users",UserRoutes);

//All api routes products
app.use("/api/products",ProductRoutes)

//All api routes cart
app.use("/api/cart",CartRoutes)

//All api routes checkout
app.use("/api/checkout",CheckoutRoutes)

//All api routes order
app.use("/api/orders",OrderRoutes)

//All api routes upload
app.use("/api/upload",UploadRoutes)

//All api routes for subscribe
app.use("/api",SubscriberRoutes)


//All api routes for admin users
app.use("/api/admin/users",AdminRoutes)



//All api routes for admin products
app.use("/api/admin/products",ProductAdminRoutes)

///All api routes for admin orders
app.use("/api/admin/orders",AdminOrderRoutes)








app.post("/api/payment/verify",(req, res) => {
  try{

        console.log("Received payment verification request:", req.body);
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const generatedSignature =  crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        if (generatedSignature === razorpay_signature) {
          console.log("Payment verification successful:", req.body);
          res.status(200).json({ message: "Payment verified successfully",
            status: 200,razorpay_payment_id, razorpay_order_id, razorpay_signature
           });
        } else {
          console.error("Payment verification failed:", req.body);
          res.status(400).json({ error: "Payment verification failed",
            status: 400
           });
        }
  } catch (error) {
    console.error("Error during payment verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  // Simulating a successful payment verification response


});

app.post("/api/payment/orders",async(req, res) => {
    console.log("Received order creation request:");
    try{
        const { amount, currency } = req.body;
        const razorpayInstance = new razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const receipt = crypto.randomBytes(10).toString('hex'); // Generate a random receipt ID

        const options={
          amount: amount*100,
          currency: currency,
          receipt:receipt,
        }

        razorpayInstance.orders.create(options,(err,order)=>{
          if(err){
            console.error("Error creating order:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          else{
            console.log("Order created successfully:", order);
            res.status(200).send({ order });
          }
        })
        console.log('Received order creation request:', req.body);
        if (!amount || !currency || !receipt) {
            return res.status(400).send({ error: "Missing required fields" });
        }


  // Simulating a successful order creation response

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

  // Here you would typically create an order in your payment gateway
  // For example, using Razorpay's API to create an order

});
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Trende Backend API");
});



app.listen(PORT, async() => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);

});

