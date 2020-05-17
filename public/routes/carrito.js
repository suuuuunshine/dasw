let tabla1 = document.querySelector('#desglose');
let tabla2 = document.querySelector('#pago')
let checkout = document.getElementById('checkout')
checkout.addEventListener('click', generarPedido)
let Products = [];
let deleted;
let pago = {
    subtotal: 0,
    envio: 0,
    total: 0
}
let cart = {}
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

getCart.then(response => { 
    cart = response
    response.products.forEach(function (product) {
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
        <td style="cursor: pointer;" class="pr-remove"><a onclick="openDeleteModal('${producto.nombre}','${producto.imagen}', '${producto._id}')" class="fa fa-times" data-toggle="modal" data-target="#modalborrar"></a></td></tr>`;
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

function generarPedido(){
    const pedido = {
        user: USERID,
        products: Products.map(product =>{
            return product._id
        }),
        total: pago.total
    }
        let realizarPedido = new Promise(function (res, rej) { 
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/pedidos`);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(pedido));
        checkout.disabled = true
        xhr.onload = function () {
            if (xhr.status != 200) {
                console.error(xhr.response)
                console.error(xhr.status + ": " + xhr.statusText);
                rej("Error de carga");
            } else {
                let cart = JSON.parse(xhr.response);
                res(cart);
            }
        };
    });
    
    realizarPedido.then(response => { 
        console.log(response)
        deleteCart().then(response=>{
            alert('Pedido realizado, ve a tu perfil para ver tu pedido')
            window.location.href = './perfil.html'
           
        })
    }).catch(function (message) {
        console.log(message);
    })
}

function deleteCart(){
   return new Promise((res, rej) =>{
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `/api/users/${USERID}/carts`);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(cart));
        xhr.onload = function () {
            if (xhr.status != 200) {
                console.error(xhr.status + ": " + xhr.statusText);
                rej("Error de carga");
            } else {
                let response = JSON.parse(xhr.response);
                res(response);
            }
        }
    })
}



function openDeleteModal(name, img, id) {
    document.querySelector('.modal-body').innerHTML = `<img src="${img}" alt="${name}"><h4>¿Seguro que deseas borrar ${name} de tu carrito?</h4>`;
    deleted = id
}




function quitarProducto(){
    cart.products = cart.products.filter(product => {
        return product._id !== deleted;
      });
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", `/api/carts`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(cart));
    xhr.onload = function (e) {
        if (xhr.status != 200) {
          console.error(xhr.response);
          console.error(xhr.status + ": " + xhr.statusText);
        } else {
            alert("Producto eliminado correctamente");
            location.reload();
        }
      };
}