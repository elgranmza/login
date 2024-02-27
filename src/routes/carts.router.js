import { Router } from "express"
import { uploader } from "../utils.js";
import cartsModel from "../dao/models/carts.model.js";
import cartManagerMongoDB from "../dao/managers/CartManagerMongoDB.js";


const router = Router();


router.get("/", async (req, res) => {
    const carts = await cartsModel.find()
    res.send({
        status: "success",
        message: carts
    })
})

//Se listara los productos de un carrito en especifico
router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartsModel.find({ _id: cid });
    res.send({
        status: "success",
        message: cart
    })

})

//Se creará un nuevo carrito
router.post("/", async (req, res) => {

    const products = [{}]
    const result = await cartsModel.create(products);

    res.send({
        status: "success",
        message: result
    })

})

router.post('/:cid/product/:pid', async (req, res) => {

    const cid = req.params.cid;
    const pid = req.params.pid;

    //ver si existe el cart
    const cart = await cartsModel.find({ _id: cid })

    if (cart.length == 0) {
        return res.send({
            error: 'Carrito no encontrado.'
        })
    }

    let productsUpdate = cartManagerMongoDB(cart, pid);
    const result = await cartsModel.updateOne({ _id: cid }, { $set: { products: productsUpdate } });

    res.send({
        status: "success",
        message: result
    })
})

export default router