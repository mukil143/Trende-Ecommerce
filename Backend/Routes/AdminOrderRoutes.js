import Order from "../models/Order.js";
import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/admin/orders
//@desc Get all orders details {only admin}
//@access Private/Admin

router.get("/", [protect, admin], async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//@route PUT /api/admin/orders/:id
//@desc Update order to delivered {only admin}
//@access Private/Admin

router.put("/:id", [protect, admin], async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if(order.isDelivered){
        return res.status(400).json({message:"Order already delivered"});
    }

    order.status = status || order.status;
    order.isDelivered = status === "Delivered" ? true : order.isDelivered;
    order.deliveredAt = status === "Delivered" ? Date.now() : order.deliveredAt;
    const updatedOrder = await order.save();
    console.log(updatedOrder);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



//@route DELETE /api/admin/orders/:id
//@desc Delete order {only admin}
//@access Private/Admin
router.delete("/:id", [protect, admin], async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if(!deletedOrder){
            return res.status(404).json({message:"Order not found"});
        }
        return res.status(200).json({message:"Order deleted successfully",id:deletedOrder._id});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
})

export default router;
