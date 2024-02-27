const cartManagerMongoDB = (cart,pid)=>{

//Buscamos el producto
const indexToUpdate = cart[0].products.findIndex(e => e.product == pid);
//si el producto existe, sumamos la cantidad.
console.log(cart)
if(indexToUpdate!= -1)
{
    const productsUpdate = [...cart[0].products]
    productsUpdate.splice(indexToUpdate, 1,{
        "product": pid,
        "quantity": cart[0].products[indexToUpdate].quantity +1
    });
    return productsUpdate
}
else //si el producto no existe, lo agregamos a array
{
    const productsUpdate=[
            ...cart[0].products,
            {
            "product": pid,
            "quantity": 1
            }]
    return productsUpdate
}

}

export default cartManagerMongoDB
