import mongoose from "mongoose";

const checkoutItemSchema = new mongoose.Schema(
    {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        name:{
            type: String,
        },
        image:{
            type: String,
            // required: true
        },
        price:{
            type:Number,
            required: true
        },
        size:{
            type: String,
            required: true
        },
        color:{
            type: String,
            required: true
        },
        quantity:{
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
)

const checkoutSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        checkoutItems:{
            type: [checkoutItemSchema],
            required: true
        },
        shippingAddress:{
            type:{
                firstName: {type: String, required: true},
                lastName: {type: String, required: true},
                email: {type: String, required: true},
                phone: {type: String, required: true},
                address: {type: String, required: true},
                city: {type: String, required: true},
                postalCode: {type: String, required: true},
                country: {type: String, required: true}
            },
            required: true
        },
        paymentMethod:{
            type: String,
            required: true
        },
        totalPrice:{
            type: Number,
            required: true,
            default: 0
        },
        isPaid:{
            type: Boolean,
            required: true,
            default: false
        },
        paidAt:{
            type: Date
        },
        paymentStatus:{
            type: String,
            default: "pending"
        },
        paymentDetails:{
            type: mongoose.Schema.Types.Mixed
        },
        isFinalized:{
            type:Boolean,
            default: false
        },
        finalizedAt:{
            type: Date
        }
    },
    {
        timestamps: true
    }
)


export default mongoose.model("Checkout", checkoutSchema);
