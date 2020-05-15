
const getPedidos = new Promise(function (res, rej) { 
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/pedidos');
  xhr.send();
  xhr.onload = function () {
      if (xhr.status != 200) {
          alert(xhr.status + ": " + xhr.statusText);
          rej("Error de carga");
      } else {
          let response = JSON.parse(xhr.response);
          
          res(response);
      }
  };
});

let fullHTML = ''
getPedidos.then(function (pedidos) {
  pedidos.forEach((pedido)=>{
    console.log('pedido', pedido)
    fullHTML = fullHTML.concat(rowHTMLgenerator(pedido))
  })
  let header = document.querySelector("#header");header.insertAdjacentHTML("afterend", fullHTML);
}).catch(function (message) {
  console.log(message);
})


function rowHTMLgenerator(pedido) {
  const products = pedido.products
  let names = ''
    products.forEach((product)=>{
     names = names.concat(`${product.nombre}, `)
  })
  return `
  <td class="hidden-xs">
    <h5 class="product-title font-alt">${names}</h5>
  </td>
  <td class="hidden-xs">
    <h5 class="product-title font-alt">${pedido.total}</h5>
  </td>
  <td>
  <h5 class="product-title font-alt">${pedido.fecha}</h5>
  </td>
  <td>
    <h5 class="product-title font-alt">${pedido.user.nombre} ${pedido.user.apellido}</h5>
  </td>
</tr>`
}


