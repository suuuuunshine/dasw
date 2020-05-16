let allProducts = new Promise((res, rej) => { //Manda llamar a todos los productos

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/categories`, true);    
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ": " + xhr.statusText);
            rej("Error de carga");
        } else {
            let prod = JSON.parse(xhr.response);//Esta recibiendo un objeto con número de pagina y lista de productos
            res(prod);
        }
    };
});

let main = document.querySelector('#menu_container');
let Products = [];
let actualPage = 1;
let numWindows = 1;
let hidden = []
let deleted = []

allProducts.then(function (data) { //Si la promesa se cumple llena un arreglo local con la lista de productos recibida
    data.productos.forEach(product => {
        Products.push(product);
    });
    fullHTML(Products);
}).catch(function (message) {
    console.log(message);
})


function fullHTML(products) {
    products.forEach(category => {
        if (!category.deleted && !category.hidden) {
            if (category.hidden) {
                hidden.push(category._id)
            } 
            const HTML = `<div class="col-sm-6 col-md-4 col-lg-4">
            <div class="shop-item">
              <div class="shop-item-image" style="max-height: 200px;"><img src="${category.imagen}" alt="${category.nombre}"/>
                <div class="shop-item-detail" onclick="verOpciones(${category._id})"  ><a onclick="verOpciones(${category._id})"  class="btn btn-round btn-b"><span  onclick="verOpciones(${category._id})" class="icon-basket">Ver opciones</span></a></div>
              </div>
              <h4 class="shop-item-title font-alt"><a href="#">${category.nombre}</a></h4>
            </div>
          </div>`
            main.insertAdjacentHTML("beforeend", HTML);
        }
    }); 
}

function verOpciones(id) {
    console.log('verOpciones', id)
    localStorage.ventanaID = id;
    window.location.href = "./menu_producto.html"
}

//Oculta la pestaña de login en el menu_producto
if(localStorage.token != ''){
    document.querySelector('#login_reg').remove()
}else{
  document.querySelector('#logout').remove()
}