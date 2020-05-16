let tabla1 = document.querySelector('#desglose');
let tabla2 = document.querySelector('#pago')
let Products = [];
let deleted;
let pago = {
    subtotal: 0,
    envio: 0,
    total: 0
}
const USERID = JSON.parse(localStorage.getItem('User'))._id
let getCart = new Promise(function (res, rej) { 
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/users/${USERID}/carts`);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            console.error(xhr.status + ": " + xhr.statusText);
            rej("Error de carga");
        } else {
            let cart = JSON.parse(xhr.response);
            res(cart);
        }
    };
});

getCart.then(cart => { 
    cart.products.forEach(function (product) {
        Products.push(product);
    });
    fullHTML(Products);
}).catch(function (message) {
    console.log(message);
})

function fullHTML(productos) {
    productos.forEach(producto => {
        let str = `<tr><td class="hidden-xs"><img src="${producto.imagen}" alt="${producto.nombre}"></td>
        <td>
            <h5 class="product-title font-alt">${producto.nombre}</h5>
            <p>${producto.descripcion}</p>
        </td>
        <td class="hidden-xs">
            <h5 class="product-title font-alt">$${producto.precio}.00</h5>
        </td>
        <td class="pr-remove"><a onclick="sndN('${producto.nombre}','${producto.cantidad}','${producto.imagen}', '${producto.id}')" class="fa fa-times" data-toggle="modal" data-target="#modalborrar"></a></td></tr>`;
        tabla1.insertAdjacentHTML("beforeend", str);

        let precio = producto.precio;
        let subtotal = precio;
        pago.subtotal += subtotal;
    });
    pago.envio = 30;
    pago.total = pago.subtotal + pago.envio;

    document.querySelector('#subtotal').innerText = `$${pago.subtotal}.00`;
    document.querySelector('#envio').innerText = `$${pago.envio}.00`;
    document.querySelector('#total h4').innerText = `$${pago.total}.00`;
}

function sndN(name, quant, img, id) {
    document.querySelector('.modal-body').innerHTML = `<img src="assets/images/${img}" alt="${name}"><h4>¿Seguro que deseas borrar ${quant} ${name} de tu carrito?</h4>`;
    deleted = id;
    console.log(deleted);
}

document.querySelector('#delete').addEventListener("click", ()=>{
    let del;
    for(let i=0;i<Products.length;i++){
        del = Products[i].id;
        console.log(del);
        if(del==deleted){
            Products.splice(i,1);
            delProd(del);
        }
    }
});

function delProd(del){
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/pedido/${del}`);
    //xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = function () {

        if (xhr.status == 200) {
            location.reload();
        } else {
            alert(xhr.status + ": " + xhr.statusText);
        }
    };
}