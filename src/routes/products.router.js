import {Router} from "express"
import { uploader } from "../utils.js";
import productsModel from "../dao/models/products.model.js";

const router = Router();


router.get("/",async(req,res)=>{
    const products = await productsModel.find()
    res.send({
        status: "success",
        message: products
    })
})

router.get("/:uid",async(req,res)=>{
    const id= req.params.uid;
    const product = await productsModel.find({_id:id});
    res.send({
        status: "success",
        message: product
    })

})

router.post("/",uploader.single("thumbnail"),async(req,res)=>{


    const {title,description,price,code,stock}=req.body;
    const filename = req.file.filename;

    if(!title||!description||!price||!code||!stock||!filename){
        return res.status(400).send({
            status: "error",
            message: "valores incompletos"
        })
    }

    const product ={
        title,
        description,
        price,
        code,
        stock,
        thumbnail:`http://localhost:8080/images/${filename}`
    }

    const result = await productsModel.create(product);

    res.send({
        status: "success",
        message: result
    })

})

router.delete("/:uid",async(req,res)=>{
    const id=req.params.uid;
    const result= await productsModel.deleteOne({_id:id});

    res.send({
        status: "success",
        message: result
    })

})

router.put("/:uid",async(req,res)=>{

    const id=req.params.uid;

    const {title,description,price,code,stock}=req.body;

    const updateProduct = {
        title,
        description,
        price,
        code,
        stock,
        thumbnail:`http://localhost:8080/images/${filename}`
    }

    const result= await productsModel.updateOne({_id:id},{$set:updateProduct});

    res.send({
        status: "success",
        message: result
    })

})

export default router