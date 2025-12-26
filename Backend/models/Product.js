import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    optional: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  colors: {
    type: [String],
    required: true,
  },
  collections: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    optional: true,
  },
  gender: {
    type: String,
    enum: ["men", "women", "unisex"],
    required: true,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
      },
    },
  ],
  isFeatured:{
    type:Boolean,
    default:false
  },
  isPublished:{
    type:Boolean,
    default:false
  },
  rating:{
    type:Number,
    default:0,
  },
  numReviews:{
    type:Number,
    default:0
  },
  tags:{
    type:[String],
    optional:true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  metaTitle:{
    type: String,
    optional: true,
  },
  metaDescription:{
    type: String,
    optional: true,
  },
  metaKeywords:{
    type: String,
    optional: true,
  },
  dimensions:{
    length:Number,
    height:Number,
    width:Number
  },
  weight:{
    type:Number,
    optional:true
  }
},{timestamps:true});

export default mongoose.model("Product", productSchema);
