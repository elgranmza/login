import fs from 'fs';
import path from "path"
import __dirname from "../utils.js"

export default class ProductManager {

    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`);
    }

    getCarts = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path,'utf-8');
            const carts = JSON.parse(data);
            return carts;
        }else{
            return [];
        }
    }

    addCart = async (products) => {
        const carts = await this.getCarts();
        let cart={id:0,products:[]};

        cart.products= [products];
        if(carts.length === 0){
            cart.id = 1
        }else{
            cart.id = carts[carts.length-1].id+1;
        }
        
        carts.push(cart);
        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,'\t'))
        return(cart.id)

    }

    getCartById = async(id) => {
        const carts = await this.getCarts();
        const cart= carts.find(e => e.id == id);
        return(cart);
    }

    addProductoToCart = async(cid,pid) => {
        const carts = await this.getCarts();
        const cartIndexToUpdate= carts.findIndex(e => e.id === cid);
        const cartToUpdate = await this.getCartById(cid)
        let cartUpdate;
        
        if(cartToUpdate)
        {
            //Buscamos el producto
            const indexToUpdate = cartToUpdate.products.findIndex(e => e.product == pid);
            //si el producto existe, sumamos la cantidad.
            if(indexToUpdate!= -1)
            {
                const productUpdate = [...cartToUpdate.products]
                productUpdate.splice(indexToUpdate, 1,{
                    "product": pid,
                    "quantity": cartToUpdate.products[indexToUpdate].quantity +1
                });

                cartUpdate={
                    "id":cid,
                    "products":[...productUpdate]
                }
            }
            else //si el producto no existe, lo agregamos a array
            {
                cartUpdate={
                    "id":cid,
                    "products":[
                        ...cartToUpdate.products,
                        {
                        "product": pid,
                        "quantity": 1
                    }]
                }
            }
            //Buscamos todos los carts
            const carts = await this.getCarts();
            //suplantamos el carrito con los nuevos datos
            console.log("cartIndexToUpdate",cartIndexToUpdate)
            carts.splice(cartIndexToUpdate, 1, cartUpdate);
            //persistencia
            await fs.promises.writeFile(this.path,JSON.stringify(carts,null,'\t'))
        }

        return cartToUpdate

    }

    
}