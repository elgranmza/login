import { Router } from "express";
import { uploader } from "../utils.js";
import ProductManagerDB from "../dao/dbManagers/ProductManagerDB.js";

const router = Router();
const productManagerMongo = new ProductManagerDB();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category } = req.query;
        const preSort = sort ? { price: sort === "asc" ? 1 : -1 } : {};
        const options = { limit: parseInt(limit), page: parseInt(page), sort: preSort, lean: true };
        const filter = category ? { category } : {};
        const products = await productManagerMongo.getProducts(filter, options);
//La respuesta del endpoint GET /api/products trae el formato con paginacion(posible correccion)
//correccion aplicada en after
const list = products.msg.docs;

        if (list.length > 0) {
            const paginationInfo = {
                docs: list,
                totalDocs: products.length, 
                limit: options.limit,
                page: options.page,
                totalPages: Math.ceil(list.length / options.limit),
                hasPrevPage: options.page > 1,
                hasNextPage: options.page < Math.ceil(list.length / options.limit)
            };
            if (paginationInfo.hasPrevPage) {
                paginationInfo.prevLink = `http://localhost:8080/api/products?limit=${limit}&page=${options.page - 1}`;
            }
            if (paginationInfo.hasNextPage) {
                paginationInfo.nextLink = `http://localhost:8080/api/products?limit=${limit}&page=${options.page + 1}`;
            }
            res.send(paginationInfo);
        } else {
            res.status(404).send({ status: "error", message: "No se encontraron productos" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await productManagerMongo.getProductByID(id);
        res.send({ status: "success", message: product });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
});

router.post("/", uploader.single("thumbnail"), async (req, res) => {
    try {
        const { title, category, description, price, code, stock } = req.body;
        const filename = req.file ? req.file.filename : "";
        const result = await productManagerMongo.createProduct(title, category, description, price, code, stock, filename);
        res.send({ status: "success", message: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const result = await productManagerMongo.deleteProduct(pid);
        res.send({ status: "success", message: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const { title, category, description, price, code, stock } = req.body;
        const result = await productManagerMongo.updateProduct(pid, title, category, description, price, code, stock);
        res.send({ status: "success", message: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
});

export default router;
