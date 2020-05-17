let MainBlock = document.querySelector("#ProductInfo");
let SecondBlock = document.querySelector("#ProductList div");
let image = document.querySelector("#ProductImage");
let title = document.querySelector("#ProductTitle h1");
let qual = document.querySelector("#ProductQual");
let price = document.querySelector("#ProductPrice");
let desc = document.querySelector("#ProductDescription");
let addbasket = document.querySelector("#ProductBasket");
let id;
let Products = [];
let hidden = [];
let deleted = [];

let producto = {
  nombre: "",
  precio: "",
  cantidad: 0,
  comentarios: "",
  imagen: "",
  _id: "",
};

let allProducts = new Promise(function (res, rej) {
  //Manda llamar a todos los productos
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `/api/categories/${localStorage.ventanaID}/products`);
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

allProducts
  .then((products) => {
    //Si la promesa se cumple
    fullHTML(products);
  })
  .catch(function (message) {
    console.log(message);
  });
let firstProduct;
function fullHTML(productsArray) {
  firstProduct = productsArray[0];
  let strImage = `<img src="${firstProduct.imagen}" alt="${firstProduct.nombre}">`;
  image.innerHTML = strImage;

  let strTitle = firstProduct.nombre;
  title.innerText = strTitle;

  let strQual = Stars(firstProduct.calificacion);
  qual.innerHTML = strQual;

  let strPrice = `$${firstProduct.precio}.00`;
  price.innerText = strPrice;

  let strDesc = firstProduct.descripcion;
  desc.innerText = strDesc;

  producto._id = firstProduct._id;
  producto.nombre = firstProduct.nombre;
  producto.precio = firstProduct.precio;
  addbasket.querySelector("span").innerText = "Agregar al carrito";
  producto.imagen = firstProduct.imagen;
  let background = `<div class="module bg-dark-60" style="background-image:url(&quot;${firstProduct.imagen}&quot;);"></div>`;
  document.querySelector("main").insertAdjacentHTML("beforeend", background);

  productsArray.forEach((e) => {
    if (e.hidden == true) {
      hidden.push(e._id);
    }
    if (e.deleted == false) {
      let strList = `<div id="${e._id}" class = "col-sm-6 col-md-3 col-lg-3">
            <div class="shop-item-image">
            <div ><img src = "${e.imagen}" alt = "${e.nombre}"></div>
                <h4 class = "shop-item-title font-alt"> ${e.nombre}</h4>
            </div>
        </div>`;
      SecondBlock.insertAdjacentHTML("beforeend", strList);
    }
  });
}

SecondBlock.addEventListener("click", (e) => {
  if (e.toElement.classList.contains("lever")) {
  } else if (e.target.localName == "span") {
  } else if (e.toElement.classList.contains("waves-effect")) {
  } else {
    let productName = e.toElement.getElementsByTagName("img")[0].alt;
    const productObject = Products.find(({ nombre }) => nombre === productName);
    image.innerHTML = `<img src="${productObject.imagen}" alt="${productObject.nombre}">`;
    title.innerText = productObject.nombre;
    qual.innerHTML = Stars(productObject.calificacion);
    price.innerText = `$${productObject.precio}.00`;
    desc.innerText = productObject.descripcion;
    producto = productObject;
    producto.cantidad = 1;
    producto.comentarios = "";
  }
});

MainBlock.addEventListener("change", (e) => {
  producto.cantidad = parseInt(quant.value);
  producto.comentarios = comment.value;
  addbasket.querySelector("span").innerText = "Agregar al carrito";
});

addbasket.addEventListener("click", (e) => {
  addbasket.querySelector("span").disabled = true;
  // addbasket.querySelector("span").innerText = "Agregado"
  e.preventDefault();
  agregarAlCarrito(producto);
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

let totalCarrito = 0;
function agregarAlCarrito(producto) {
  const productId = producto._id;
  const user = JSON.parse(localStorage.getItem("User"));
  const user_id = user._id;
  let products = [];
  let getCart = new Promise(function (res, rej) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/users/${user_id}/carts`);
    xhr.send();
    xhr.onload = function () {
      if (xhr.status != 200) {
        console.error(xhr.status + ": " + xhr.statusText);
        rej("Error de carga");
      } else {
        res(xhr.response);
      }
    };
  });

  getCart.then((response) => {
    if(response != 'null'){ // quiere decir que ya hay carrito, se agrega el producto y se hace un push
        const cart = JSON.parse(response);
        const cartId = cart._id
        const pastProducts = cart.products.map((product) => {
          return product._id;
        });

        products = pastProducts;
        products.push(productId);
        totalCarrito += cart.total
        totalCarrito += producto.precio;

        let xhr = new XMLHttpRequest();
        const cartObject = {
          _id: cartId,
          user_id,
          products,
          total: totalCarrito,
        };

        xhr.open("PUT", `/api/carts`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(cartObject));
        xhr.onload = function (e) {
          if (xhr.status != 200) {
            console.error(xhr.response);
            console.error(xhr.status + ": " + xhr.statusText);
          } else {
            const pedir = confirm(
              "Producto agregado al carrito, ¿deseas realizar el pedido?"
            );
            if (pedir == true) {
              window.location.href = "./carrito.html";
            } else {
              e.preventDefault();
            }
          }
        };
    }else{
        products.push(productId)
        const cartObject = { user_id, products, total: totalCarrito };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/carts", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(cartObject));
        xhr.onload = function (e) {
          if (xhr.status != 200) {
            console.error(xhr.response);
            console.error(xhr.status + ": " + xhr.statusText);
          } else {
            localStorage.setItem("cart", JSON.parse(xhr.response)._id);
            const pedir = confirm(
              "Producto agregado al carrito, ¿deseas realizar el pedido?"
            );
            if (pedir == true) {
              window.location.href = "./carrito.html";
            } else {
              e.preventDefault();
            }
          }
        };
    }  
  });
}
