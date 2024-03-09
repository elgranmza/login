const crearCarrito = () => {
    const endpoint = `http://localhost:8080/api/carts`;

    fetch(endpoint, {
        method: "POST"
    })
    .then((resp) => resp.json())
    .then((data) => {
        console.log("Estamos dentro de crear carrito: ", data.message._id);
        localStorage.setItem('cid', data.message._id);

        const botonesCard = document.getElementsByName("btn");

        for (let boton of botonesCard) {
            boton.addEventListener('click', (e) => {
                agregarCarrito(data.message._id, e.target.id);
            });
        }
    });
};

const agregarCarrito = (cid, pid) => {
    const endpoint = `http://localhost:8080/api/carts/${cid}/product/${pid}`;
    const data = {};

    fetch(endpoint, {
        method: "POST"
    }).then((resp) => {
        console.log(resp);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // si existe
    const cid = localStorage.getItem('cid');

    if (cid) {
        console.log('Ya hay un carrito existente:', cid);
    } else {
        crearCarrito();
    }
});
