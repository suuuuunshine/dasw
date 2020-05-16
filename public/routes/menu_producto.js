let MainBlock = document.querySelector('#ProductInfo');
let SecondBlock = document.querySelector('#ProductList div');
let image = document.querySelector('#ProductImage');
let title = document.querySelector('#ProductTitle h1');
let qual = document.querySelector('#ProductQual');
let price = document.querySelector('#ProductPrice');
let desc = document.querySelector('#ProductDescription');
let quant = document.querySelector('#ProductQuantity input');
let addbasket = document.querySelector('#ProductBasket');
let comment = document.querySelector('#ProductComment textarea');
let id;
let Products = [];
let hidden = []
let deleted = []

let pedido = {
    nombre: "",
    precio: "",
    cantidad: 0,
    comentarios: "",
    imagen: ""
};

let allProducts = new Promise(function (res, rej) { //Manda llamar a todos los productos
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/categories/${localStorage.ventanaID}/products`);
    //xhr.setRequestHeader("", "");
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ": " + xhr.statusText);
            rej("Error de carga de productos");
        } else {
            Products = JSON.parse(xhr.response);
            res(Products);
        }
    };
});

allProducts.then(data => { //Si la promesa se cumple
    fullHTML(data);
}).catch(function (message) {
    console.log(message);
})

function fullHTML(arr) {
    let prod = arr[0];
    let strImage = `<img src="${prod.imagen}" alt="${prod.nombre}">`;
    image.innerHTML = strImage;

    let strTitle = prod.nombre;
    title.innerText = strTitle;

    let strQual = Stars(prod.calificacion);
    qual.innerHTML = strQual;

    let strPrice = `$${prod.precio}.00`;
    price.innerText = strPrice;

    let strDesc = prod.descripcion;
    desc.innerText = strDesc;

    quant.value = 1;
    comment.value = "";

    pedido.nombre = prod.nombre;
    pedido.precio = prod.precio;
    pedido.cantidad = quant.value;
    pedido.comentarios = comment.value;
    addbasket.querySelector("span").innerText = "Agregar a la canasta"
    pedido.imagen = prod.imagen;
    let background = `<div class="module bg-dark-60" style="background-image:url(&quot;${prod.imagen}&quot;);"></div>`
    document.querySelector('main').insertAdjacentHTML("beforeend", background)

    arr.forEach(e => {
        if (e.hidden == 1) {
            hidden.push(e.id)
        }
        if (e.deleted == 0) {
        let strList = `<div id="container_${e._id}" class = "col-sm-6 col-md-3 col-lg-3">
            <div class="shop-item-image">
            <div ><img src = "${e.imagen}" alt = "${e.nombre}"></div>
                <h4 class = "shop-item-title font-alt"> ${e.nombre}</h4>
            </div>
        </div>`;
        SecondBlock.insertAdjacentHTML("beforeend", strList);
    } else {
        console.log("Sí, está eliminado");
    }
    });

}

SecondBlock.addEventListener("click", (e) => {
    if(e.toElement.classList.contains('lever')){
    }else if(e.target.localName == 'span'){
    }else if(e.toElement.classList.contains('waves-effect')){
    }else{
        let product = e.toElement.getElementsByTagName('img')[0].alt
        let d = Products.filter(p => p.nombre == product);
        let dd = d.pop();
        image.innerHTML = `<img src="${dd.imagen}" alt="${dd.nombre}">`;
        title.innerText = dd.nombre;
        qual.innerHTML = Stars(dd.calificacion);
        price.innerText = `$${dd.precio}.00`;
        desc.innerText = dd.descripcion;
        quant.value = 1;
        comment.value = "";
        
        pedido.nombre = dd.nombre;
        pedido.precio = dd.precio;
        pedido.cantidad = 1;
        pedido.comentarios = "";
        pedido.imagen = dd.imagen;
    }    
});

MainBlock.addEventListener("change", (e) => {
    pedido.cantidad = parseInt(quant.value);
    pedido.comentarios = comment.value;
    addbasket.querySelector("span").innerText = "Agregar a la canasta"
});

addbasket.addEventListener("click", (e) => {
    addbasket.querySelector("span").disabled = true
    addbasket.querySelector("span").innerText = "Agregado"
    e.preventDefault();
    addProd(JSON.stringify(pedido));
});

function Stars(num) {
    switch (num) {
        case 1:
            return `<span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i>Calificación</i></span>`;
        case 2:
            return `<span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i>Calificación</i></span>`;
        case 3:
            return `<span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i>Calificación</i></span>`;
        case 4:
            return `<span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star-off"></i></span>
            <span><i>Calificación</i></span>`;
        default:
            return `<span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i class="fa fa-star star"></i></span>
            <span><i>Calificación</i></span>`;
    }
}

function addProd(obj) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(obj);
    xhr.onload = function (e) {
        if (xhr.status != 201) {
            alert(xhr.status + ": " + xhr.statusText);
        } else {
            e.preventDefault();
        }
    };
}
