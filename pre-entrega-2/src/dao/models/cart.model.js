import mongoose, { Schema } from "mongoose";

const cartCollection = "cart";

const productSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
                quantity: { type: Number, required: true, integer: true }
            }
        ],
        default: []
    }
})

const cartSchema = new mongoose.Schema({
    products: [productSchema]
})

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;