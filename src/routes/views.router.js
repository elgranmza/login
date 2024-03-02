import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import CartManagerDB from "../dao/dbManagers/CartManagerDB.js";
import ProductManagerDB from "../dao/dbManagers/ProductManagerDB.js";

const cartManagerMongo = new CartManagerDB();
const productManagerMongo = new ProductManagerDB();
const router = Router();

router.get("/", (req, res) => {
    res.render("register");
});

router.get("/usuarios", async (req, res) => {
    try {
        const users = await userModel.find().lean();
        res.render("users", { users, isAdmin: true });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category } = req.query;
        const preSort = sort ? { price: sort === "asc" ? 1 : -1 } : {};
        const options = { limit: parseInt(limit), page: parseInt(page), sort: preSort, lean: true };
        const filter = category ? { category } : {};
        const result = await productManagerMongo.getProducts(filter, options);

        if (result.msg.hasPrevPage) {
            result.msg.prevPage = `http://localhost:8080/products?page=${options.page - 1}`;
        }

        if (result.msg.hasNextPage) {
            result.msg.nextPage = `http://localhost:8080/products?page=${options.page + 1}`;
        }

        // Agregar cid a cada producto para Handlebars
        result.msg.docs.forEach(data => {
            data.cid = "658cbaa3b299fdafc649721c";
        });

        res.render("products", { msg: result.msg });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const carts = await cartManagerMongo.getCartsByID(cid);
        res.render("carts", { carts });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/chat", async (req, res) => {
    try {
        //const chat = await chatModel.find().lean();
        res.render("chat", {});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

export default router;
