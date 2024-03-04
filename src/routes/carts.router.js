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
        const products = req.body.products;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).send({ status: "error", message: "Se requiere al menos un producto para agregar al carrito" });
        }

        for (const product of products) {
            const { pid, quantity } = product;
            if (!pid || !quantity) {
                return res.status(400).send({ status: "error", message: "Cada producto debe tener un ID y una cantidad especificada" });
            }
        }

        const result = await cartManagerMongo.addProductsToCart(cid, products);
        res.send({ status: "success", message: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Error al actualizar el carrito" });
    }
});


router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).send({ status: "error", message: "La cantidad debe ser un número entero superior a cero" });
        }

        const result = await cartManagerMongo.updateQuantityOfProduct(cid, pid, quantity);
        res.send({ status: "success", message: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Error al actualizar la cantidad del producto en el carrito" });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManagerMongo.getCartsByID(cid);
        if (!cart) {
            return res.status(404).send({
                status: "error",
                message: "El carrito especificado no existe"
            });
        }
        const result = await cartManagerMongo.deleteAllProductsInCart(cid);
        res.send({
            status: "success",
            message: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "Error al eliminar todos los productos del carrito"
        });
    }
});


export default router;
