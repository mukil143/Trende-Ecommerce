import express from "express";
import Checkout from "../models/Checkout.js";
// import User from "../models/User.js";
import protect from "../Middleware/authMiddleware.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js"
import mongoose from "mongoose";

const router = express.Router();

// @route POST /api/checkout
// @desc Create a checkout session
// @access Private

router.post("/", [protect], async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;
  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No checkout items" });
  }

  const newCheckout = new Checkout({
    user: req.user._id,
    checkoutItems: checkoutItems,
    shippingAddress,
    paymentMethod: paymentMethod || "Razorpay",
    totalPrice,
    isPaid: false,
    paymentStatus: "Pending",
  });

  await newCheckout.save();

  console.log(`Checkout created for ${req.user._id}`);
  return res.status(201).json(newCheckout);
});

//@route PUT /api/checkout/:id
//@desc Update checkout  Logged in User marked as paid after successfull payment
//@access Private
router.put("/:id/pay", [protect], async (req, res) => {
  const { paymentStatus, paymentDetails, paymentMethod } = req.body;
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paidAt = Date.now();
      (checkout.paymentStatus = paymentStatus),
        (checkout.paymentDetails = paymentDetails);
      // checkout.paymentMethod=paymentMethod
      const updatedCheckout = await checkout.save();
      return res.status(200).json(updatedCheckout);
    } else {
      return res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//@route GET api/checkout/:id/finalize
//@desc finalize checkout and convert  to an order after successfull payment
//@access Private
router.get("/:id/finalize", [protect], async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    console.log(checkout);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    if (checkout.isPaid && !checkout.isFinalized) {
      //create order to convert checkout to order and set isFinalized to true
      const finalOrder = new Order({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
        isDelivered: false,
      });
      //save the order
      // after you save the order
      const saved = await finalOrder.save();


      // verify it exists by querying the DB directly


      // print connection name and host (dev-only logging)



      // full saved doc for inspection (optional)

      //Mark the checkout as finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();
      // return res.status(200).json(Finalizeorder);

      //delete the cart from the user associated with the checkout
      await Cart.findOneAndDelete({ user: checkout.user });

      return res.status(200).json(saved);
    } else if (checkout.isFinalized) {
      return res
        .status(400)
        .json({ message: "Checkout has already been finalized" });
    } else {
      return res
        .status(400)
        .json({ message: "Incomplete payment or checkout not paid" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
