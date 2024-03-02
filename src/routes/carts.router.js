import { Router } from "express";
import CartManagerDB from "../dao/dbManagers/CartManagerDB.js";

const router = Router();
const cartManagerMongo = new CartManagerDB();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManagerMongo.getCarts();
        res.send({
            status: "success",
            message: carts
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al obtener los carritos"
        });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManagerMongo.getCartsByID(cid);
        res.send({
            status: "success",
            message: cart
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al obtener el carrito"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const result = await cartManagerMongo.createCart();
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al crear el carrito"
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = 1; // Se asume una cantidad predeterminada de 1
        const result = await cartManagerMongo.addProductInCart(cid, pid, quantity);
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al agregar producto al carrito"
        });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await cartManagerMongo.deleteProductInCart(cid, pid);
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al eliminar producto del carrito"
        });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const products = req.body.products; // Se espera un array de productos
        const result = await cartManagerMongo.updateCart(cid, products);
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al actualizar el carrito"
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        const result = await cartManagerMongo.updateQualityProduct(cid, pid, quantity);
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al actualizar la cantidad del producto en el carrito"
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const result = await cartManagerMongo.deleteAllProductsInCart(cid);
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Error al eliminar todos los productos del carrito"
        });
    }
});

export default router;
