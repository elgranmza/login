import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Products";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true }
});

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(collection, productsSchema);

export default productsModel;
