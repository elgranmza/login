import mongoose from "mongoose";

const collection = "Products"

const productsSchema = new mongoose.Schema({

    title: String,
    description: String,
    price:Number,
    code:{
        type: String,
        unique:true
    },
    stock:Number,
    thumbnail:String
})

const productsModel = mongoose.model(collection,productsSchema)

export default productsModel