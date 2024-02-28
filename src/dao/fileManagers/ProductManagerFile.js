import fs from 'fs';
import path from "path"
import __dirname from "../../utils.js"

export default class ProductManager {

    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`);
    }

    getProducts = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path,'utf-8');
            const products = JSON.parse(data);
            return products;
        }else{
            return [];
        }
    }


    addProduct = async (product) => {
        const products = await this.getProducts();
        if(products.length === 0){
            product.id = 1
        }else{
            product.id = products[products.length-1].id+1;
        }
        products.push(product);
        await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'))
        //return products;

    }

    getProductById = async(id) => {
        const products = await this.getProducts();
        const itemBuscado = products.find(e => e.id == id);
        return(itemBuscado);
    }

    updateProduct = async (id,newData)=>{
        
        //nweData es un objeto con los campos a cambiar. Pueden faltar campos.
        const oldData = await this.getProductById(id)
        if(oldData)
        {
            //actualizo el producto
            Object.keys(oldData).forEach(k => {
                Object.keys(newData).forEach(z => {
                 if (k === z) {                    
                  oldData[k] = newData[z];
                 }
                });
               });

            //Obtengo el arreglo entero
            let allProducts = await this.getProducts();
            //busco el index del elemento a borrar
            const indexToUpDate = allProducts.findIndex((e)=>e.id === id)
            //console.log("El id buscado es:",id)
            //console.log("indexToUpDate",indexToUpDate)
            //suplanto elemento
            allProducts.splice(indexToUpDate, 1, oldData);
            //muestro el array actualizado
            //console.log("array actualizado:",allProducts);
            //Guardo en archivo persistente
            await fs.promises.writeFile(this.path,JSON.stringify(allProducts,null,'\t'))

        }
        return(oldData);
        
    }

    deleteProduct = async (id)=>{
        let allProducts = await this.getProducts();
        const indexToUpDate = allProducts.findIndex((e)=>e.id === id)
        console.log(indexToUpDate)
        if(indexToUpDate != -1)
        {
            allProducts.splice(indexToUpDate, 1);
            await fs.promises.writeFile(this.path,JSON.stringify(allProducts,null,'\t'))
        }

        return(indexToUpDate)
        
    }

    

}