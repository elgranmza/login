//Aca hay un problema. Cada vez que se avanza en la paginacion, se vuelve a cargar el scrip y se crea un nuevo carrito.

const crearCarrito = ()=>{

    const endpoint =`http://localhost:8080/api/carts`;

    fetch(endpoint,{
        method:"POST"
    })
    .then((resp)=>resp.json())
    .then((data)=>{
        console.log("Estamos dentro de crear carrito: ",data.message._id)

        const botonesCard = document.getElementsByName("btn");

        for (let boton of botonesCard) {
            boton.addEventListener('click', (e)=> {
                agregarCarrito(data.message._id,e.target.id); })
        }
    })

}

const agregarCarrito=(cid,pid)=>{
    const endpoint =`http://localhost:8080/api/carts/${cid}/product/${pid}`;
    const data= {}

    fetch(endpoint,{
        method:"POST"
    }).then((resp)=>{console.log(resp)})

}


//Creamos carrito para obtener el "cid"
//const cid= "658cbaa3b299fdafc649721c"
crearCarrito()

