let tabla1 = document.querySelector('#desglose');
let tabla2 = document.querySelector('#pago')
let Products = [];
let deleted;
let pago = {
    subtotal: 0,
    envio: 0,
    total: 0
}

let allProducts = new Promise(function (res, rej) { //Manda llamar a todos los productos
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/pedido');
    //xhr.setRequestHeader("", "");
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ": " + xhr.statusText);
            rej("Error de carga");
        } else {
            let prod = JSON.parse(xhr.response);
            res(prod);
        }
    };
});

allProducts.then(function (data) { //Si la promesa se cumple
    data.forEach(function (e) {
        Products.push(e);
    });
    fullHTML(Products);
}).catch(function (message) {
    console.log(message);
})

function fullHTML(arr) {
    arr.forEach(e => {
        let str = `<tr><td class="hidden-xs"><img src="assets/images/${e.imagen}" alt="${e.nombre}"></td>
        <td>
            <h5 class="product-title font-alt">${e.nombre}</h5>
            <p>${e.comentarios}</p>
        </td>
        <td class="hidden-xs">
            <h5 class="product-title font-alt">$${e.precio}.00</h5>
        </td>
        <td>
            <h5 class="product-title font-alt">${e.cantidad}</h5>
        </td>
        <td>
            <h5 class="product-title font-alt">$${e.precio * e.cantidad}.00</h5>
        </td>
        <td class="pr-remove"><a onclick="sndN('${e.nombre}','${e.cantidad}','${e.imagen}', '${e.id}')" class="fa fa-times" data-toggle="modal" data-target="#modalborrar"></a></td></tr>`;
        tabla1.insertAdjacentHTML("beforeend", str);

        let cantidad = e.cantidad;
        let precio = e.precio;
        let subtotal = cantidad * precio;
        pago.subtotal += subtotal;
    });
    pago.envio = 30;
    pago.total = pago.subtotal + pago.envio;

    document.querySelector('#subtotal').innerText = `$${pago.subtotal}.00`;
    document.querySelector('#envio').innerText = `$${pago.envio}.00`;
    document.querySelector('#total h4').innerText = `$${pago.total}.00`;
}

function sndN(name, quant, img, id) {
    document.querySelector('.modal-body').innerHTML = `<img src="assets/images/${img}" alt="${name}"><h4>¿Seguro que deseas borrar ${quant} ${name} de tu canasta?</h4>`;
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