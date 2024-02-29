import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "product";

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    code: {type: String, required: true, unique: true},
    stock: {type: Number, required: true},
    thumbnail: {type: String},
    category: {type: String, enum: ["Tecnologia", "Electrodomesticos", "Ropa", "Deporte", "Accesorios"]},
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;