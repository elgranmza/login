import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

class CartManagerDB{

    getCarts = async()=>{
        const carts = await cartsModel.find().lean();
        return carts;
    } 

    getCartsByID = async(cid)=>{

        try{
            const cart = await cartsModel.findOne({_id:cid}).lean();
            return cart;
        }
        catch(error){
            console.log(error)
            return {
                status: "error",
                msg: `El carrito con el id ${cid} no existe`
            }
        }
        
    } 

    createCart = async()=>{
        const cart = await cartsModel.create({});
        return cart;
    } 

    addProductInCart = async(cid,pid,quantity)=>{
        const cart = await cartsModel.findOne({_id:cid})
        if(!cart){
            return {
                status: error,
                msg: `El carrito con el id ${cid} no existe`
            }
        }

        const product = await productsModel.findOne({_id:pid})
        if(!product){
            return {
                status: error,
                msg: `El producto con el id ${pid} no existe`
            }
        }

        //Buscamos el producto
        const index = cart.products.findIndex(e => e.product == pid);
        //si el producto existe, sumamos la cantidad.
        if(index!= -1)
        {
            const productUpdate = {
                "product": pid,
                "quantity": cart.products[index].quantity + quantity
            }
            cart.products.splice(index, 1,productUpdate);
            await cart.save();     
        }
        else //si el producto no existe, lo agregamos a array
        {
            const newProduct=
                    {
                    "product": pid,
                    "quantity": quantity
                    }
            cart.products.push(newProduct)
            await cart.save();    
        }

        return cart;


    }

    deleteProductInCart = async(cid,pid)=>{

        const cart = await cartsModel.findOne({_id:cid})
        //Buscamos el producto
        const index = cart.products.findIndex(e => e.product == pid);
        //si el producto existe, lo eliminamos
        if(index!= -1)
        {
            const result= cart.products.splice(index,1)
            await cart.save();
            return {
                status: "success",
                msg: result
            } 
        }
        else{
            return {
                status: "error",
                msg: `El producto con el id ${pid} no existe`
            }
        }

    }

    deleteAllProductsInCart = async(cid)=>{

        const cart = await cartsModel.findOne({_id:cid})   
        cart.products.splice(0,cart.products.length)    //borramos todo
        await cart.save();  

        return {
            status: "success",
            msg: cart
        }

    }

    updateCart = async(cid,products)=>{

        const cart = await cartsModel.findOne({_id:cid})   
        cart.products.splice(0,cart.products.length)    //borramos todo
        cart.products.push(...products.products)
        await cart.save();  

        return {
            status: "success",
            msg: cart
        }

    }

    updateQualityProduct = async(cid,pid,quantity)=>{

        const cart = await cartsModel.findOne({_id:cid})

        const index = cart.products.findIndex(e => e.product == pid);
        //si el producto existe, actualizamos cantidad
        if(index!= -1)
        {
            console.log("quantity: ",quantity)
            console.log("index",index)
            console.log(cart)

            const newProduct={
                    product: pid,
                    quantity: parseInt(quantity)
                    }

            cart.products.splice(index,1)
            cart.products.push(newProduct)
            await cart.save();
            return {
                status: "success",
                msg: cart
            } 
        }
        else{
            return {
                status: "error",
                msg: `El producto con el id ${pid} no existe`
            }
        }

    }


}

export default CartManagerDB


