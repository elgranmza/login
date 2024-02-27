import {Router} from "express"
import userModel from "../dao/models/user.model.js"
import productsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.model.js";

const router = Router();

router.get("/",(req,res)=>{
    res.render("register")
})

router.get("/usuarios",async(req,res)=>{
    const users = await userModel.find().lean();
    res.render("users",{users,isAdmin:true})

})

router.get("/products",async(req,res)=>{
    const products = await productsModel.find().lean();
    res.render("products",{products})

})

router.get("/carts",async(req,res)=>{
    const carts = await cartsModel.find().lean();
    res.render("carts",{carts})

})

router.get("/chat",async(req,res)=>{
    //const chat = await chatModel.find().lean();
    res.render("chat",{})

})

export default router;