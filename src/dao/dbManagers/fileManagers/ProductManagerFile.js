import fs from 'fs';
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class ProductManager {

    constructor(pathFile) {
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error while getting products:", error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            if (products.length === 0) {
                product.id = 1;
            } else {
                product.id = products[products.length - 1].id + 1;
            }
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch (error) {
            console.error("Error while adding product:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const itemBuscado = products.find(e => e.id == id);
            return itemBuscado;
        } catch (error) {
            console.error("Error while getting product by ID:", error);
            throw error;
        }
    }

    async updateProduct(id, newData) {
        try {
            const oldData = await this.getProductById(id);
            if (oldData) {
                Object.keys(oldData).forEach(k => {
                    if (k in newData) {
                        oldData[k] = newData[k];
                    }
                });

                let allProducts = await this.getProducts();
                const indexToUpDate = allProducts.findIndex(e => e.id === id);
                allProducts.splice(indexToUpDate, 1, oldData);
                await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, '\t'));
            }
            return oldData;
        } catch (error) {
            console.error("Error while updating product:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            let allProducts = await this.getProducts();
            const indexToDelete = allProducts.findIndex(e => e.id === id);
            if (indexToDelete !== -1) {
                allProducts.splice(indexToDelete, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, '\t'));
            }
            return indexToDelete;
        } catch (error) {
            console.error("Error while deleting product:", error);
            throw error;
        }
    }
}
