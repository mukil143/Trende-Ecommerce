import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import protect from "../Middleware/authMiddleware.js";
import { number } from "motion";

const router = express.Router();

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId }).populate({path:"user",select:"-password"});
  } else if (guestId) {
    return await Cart.findOne({ guestId: guestId });
  }

  return null;
};


function isSameProduct(p, productId, size, color, product) {
  return (
    p.productId.toString() === productId.toString() &&
    p.size === (size || product.sizes[0]) &&
    p.color === (color || product.colors[0])
  );
}


//@route POST /api/cart
//@desc Add item to cart for Guest User or Logged in User
//@access Public

router.post("/", async (req, res) => {
  const {
    productId,
    name,
    image,
    price,
    size,
    color,
    quantity,
    userId,
    guestId,
  } = req.body;
  console.log({
    productId,
    name,
    image,
    price,
    size,
    color,
    quantity,
    userId,
    guestId,
  });
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If user is logged in
    let cart = await getCart(userId, guestId);

    if (cart) {
      //if cart exists, update it

      const itemIndex = cart.products.findIndex(p => isSameProduct(p, productId, size, color, product));
      console.log(itemIndex);

      const qty = Number(quantity);
      //if product exists in cart, update the quantity
      if (itemIndex > -1) {
        //if product exists in cart, update the quantity
        cart.products[itemIndex].quantity += qty;
      } else {
        //if product does not exist in cart, add new item
        cart.products.push({
          productId: productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size: product.sizes.includes(size) ? size : product.sizes[0], //validate size if not valid, set to first size
          color: product.colors.includes(color) ? color : product.colors[0], //validate color if not valid, set to first color
          quantity: qty,
        });
      }

      //Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      cart.totalPrice = Math.ceil(cart.totalPrice);

      await cart.save();
      return res.status(201).json(cart);
    } else {
      //if no cart, create new cart
      const newCart = await Cart.create({
        user: userId ? userId : null,
        guestId: guestId || "guest_" + Date.now().toString(),
        products: [
          {
            productId: productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size: product.sizes.includes(size) ? size : product.sizes[0], //validate size if not valid, set to first size
            color: product.colors.includes(color) ? color : product.colors[0], //validate color if not valid, set to first color
            quantity: quantity,
          },
        ],
        totalPrice: Math.ceil(product.price * quantity),
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route PUT /api/cart
//@desc Update quantity of item in cart for Guest User or Logged in User
//@access Public

router.put("/", async (req, res) => {
  const { productId, size, color, quantity, userId, guestId } = req.body;
  try {
    console.log(req.body);
    const product = await Product.findById(productId);
    const qty = Number(quantity);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.products.findIndex(p => isSameProduct(p, productId, size, color, product));
    console.log(itemIndex); 

    if (itemIndex > -1) {
      //if product exists in cart, update the quantity
      if (quantity > 0) {
        cart.products[itemIndex].quantity = qty;
      } else {
        cart.products.splice(itemIndex, 1); //remove item if quantity is 0
      }
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    cart.totalPrice = Math.ceil(cart.totalPrice);
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE /api/cart
//@desc delet the product from cart for Guest User or Logged in User
//@access Public
router.delete("/", async (req, res) => {
  const { productId, size, color, userId, guestId } = req.body;
  console.log(productId)
  try {
    let cart = await getCart(userId, guestId);
    const product = await Product.findById(productId);
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.products.findIndex((p) => p.productId == productId && p.size == (size? size : product.sizes[0]) && p.color == color ? color : product.colors[0]);
    console.log(itemIndex);
    if (itemIndex > -1) {
      cart.products.splice(itemIndex, 1); //remove item
    }
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    console.log(cart);
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/cart
//@desc Get cart for Guest User or Logged in User
//@access Public

router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    console.log({ userId, guestId });
    const cart = await getCart(userId, guestId);
    if (cart?.user?._id.toString() === userId || cart?.guestId === guestId) {
      return res.status(200).json(cart);
    } 
    
      return res.status(404).json({ message: "Cart not found" });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route POST /api/cart/merge
//@desc Merge cart when Guest User logs in
//@access Private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    const guestCart = await Cart.findOne({ guestId: guestId }); //find guest cart
    // console.log("Guest Cart:", guestCart);
    const userCart = await Cart.findOne({ user: req.user._id }); //find user cart
    // console.log("User Cart:", userCart);
    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({success:false, message: "Guest cart is empty" });
      }
      if (userCart) {
        //if user cart exists, merge carts
        guestCart.products.forEach((guestProduct) => {
          const itemIndex = userCart.products.findIndex(
            (p) =>
              p.productId.toString() === guestProduct.productId.toString() &&
              p.size === guestProduct.size &&
              p.color === guestProduct.color
          );
          if (itemIndex > -1) {
            //if product exists in user cart, update the quantity
            userCart.products[itemIndex].quantity += guestProduct.quantity;
          } else {
            //if product does not exist in user cart, add new item
            userCart.products.push(guestProduct);
          }
        });
        //Recalculate total price
        userCart.totalPrice = Math.round(userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ));


        //Save user cart
        await userCart.save();
        //Delete guest cart
        try {
          await Cart.findOneAndDelete({ guestId: guestId }); //delete guest cart
        } catch (error) {
          console.error("Error deleting guest cart:", error);
          return res.status(500).json({success:false, message: "Server Error" });
        }
        return res.status(200).json({success:true,cart:userCart});
      } else {
        //if  user has not existing cart, assign guest cart to user
        guestCart.user = req.user._id; //assign user to guest cart
        guestCart.guestId = undefined; //remove guestId
        await guestCart.save();
        return res.status(200).json({success:true,cart:guestCart});
      }
    } else {
      //guest cart has already been merged ,return user cart
      if (userCart) {
        return res.status(200).json({success:true,cart:userCart});
      }
      return res.status(404).json({success:false, message: "Guest cart not found" });
    }
  } catch (error) {
    console.error("Error merging carts:", error);
    return res.status(500).json({success:false, message: "Server Error" });
  }
});

export default router;
