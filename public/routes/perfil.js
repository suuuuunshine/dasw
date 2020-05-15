let user = JSON.parse(localStorage.getItem("User"));

let userData = document.querySelector("#user-data");
userData.insertAdjacentHTML("beforeend", getHTML());
function getHTML() {
  return `<form method="submit" id="userDataForm"><div class="col-sm-3 col-md-3 col-lg-3">
          <div class="row">
            <div class="col" style="text-align: center;">
              <label
                style="height: 150px; width: 150px;border-radius: 50%; background-image: url(${
                  user.imageUrl || "assets/images/placeholder-user.png"
                }); background-position: center; background-size: cover;"
                class="user-avatar" id="user-avatar" for="userProfileAvatar">
              </label>
              <input ref="inputFile" type="file" accept="image/*" name="userProfileAvatar"
                id="userProfileAvatar" onchange="handleInputFileChange(event)" />
            </div>
          </div>
          <div class="row work-details" style="margin-top: 10px;">
            <ul>
              <li><strong>Teléfono: </strong><span class="font-serif">
                  <input name="telefono" type="tel" class="form-control" placeholder="telefono" value="${
                    user.telefono != "null" ? user.telefono : ""
                  }" />
              </li>
              <li><strong>Email: </strong> <input name="correo" disabled type="email" class="form-control" placeholder="correo"
                  value="${user.correo || ""}" />
              </li>
            </ul>
          </div>
          </div>
          <div class="col-sm-9 col-md-9 col-lg-9">
          <div class="work-details">
            <h5 class="work-details-title font-alt">Detalle de perfil</h5>
            <ul>
              <li><strong>Nombre: </strong><span class="font-serif">
                  <input name="nombre" type="text" class="form-control" placeholder="nombre" value="${
                    user.nombre || ""
                  }" />
              </li>
              <li><strong>Apellido: </strong> <input name="apellido" type="text" class="form-control" placeholder="apellido"
                  value="${user.apellido || ""}" />
              </li>
              <li><strong>Cambiar contraseña:
                  <input name="password" type="password" class="form-control" placeholder="Contraseña actual"
                    style="margin-bottom:6px;" />
                  <input name="passwordConfirm" type="password" class="form-control" placeholder="Contraseña nueva" />
              </li>
            </ul>
            <textarea name="description"  id="description" class="form-control" rows="7" placeholder="Descripción de tu perfil"
            spellcheck="false">${user.descripcion} </textarea>
          </div>
          <button class="btn btn-primary" id="save" type="submit" >Guardar Cambios</button>
          <button class="btn btn-danger" id="cancelar" >Cancelar</button>
          </div></form>`;
}
const submitButton = document.getElementById("save");
submitButton.addEventListener("click", updateUser);
const cancelButton = document.getElementById("cancelar");
cancelButton.addEventListener("click", user = JSON.parse(localStorage.getItem("User")))

const input = document.querySelector("#userProfileAvatar");
input.style.opacity = 0;

function handleInputFileChange(event) {
  const file = event.target.files[0];
  if (validFileType(file)) {
    document.getElementById(
      "user-avatar"
    ).style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    user.image = file;
    user.imageUrl = "assets/images/profilephoto.jpg";
    localStorage.setItem("User", JSON.stringify(user));
  } else {
    alert(
      `File name ${file.name}: Not a valid file type. Update your selection.`
    );
  }
}

const fileTypes = ["image/gif", "image/jpeg", "image/png"];

function validFileType(file) {
  return fileTypes.includes(file.type);
}

function updateUser(event) {
  event.preventDefault();
  const form = document.forms.userDataForm;

  const formData = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    telefono: form.telefono.value,
    password: form.password.value,
    descripcion: form.description.value,
    _id: user.id,
  };

  
  let xhr = new XMLHttpRequest();
  xhr.open("PATCH", "/api/user");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(formData.id, formData);
  xhr.onload = function () {
    if (xhr.status != 200) {
      console.log(xhr.status);
      console.log("Error de carga");
    } else {
      localStorage.setItem("User", JSON.stringify(formData));
      let response = JSON.parse(xhr.response);
      alert("Usuario actualizado correctamente", response);
    }
  };
  
}

const getPedidos = new Promise(function (res, rej) { 
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `/api/pedidos/${user._id}`);
  xhr.send();
  xhr.onload = function () {
      if (xhr.status != 200) {
          // alert(xhr.status + ": " + xhr.statusText);
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
</tr>`
}


