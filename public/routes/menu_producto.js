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

    // DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
    // PRODUCTTYPES AHORA ES PRODUCT
    // PRODUCT AHORA ES CATEGORY
    // xhr.open('GET', `http://localhost:3000/api/producttype?tipo=${localStorage.ventanaID}`);

    xhr.open('GET', `http://localhost:3000/api/product?tipo=${localStorage.ventanaID}`);
    //xhr.setRequestHeader("", "");
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ": " + xhr.statusText);
            rej("Error de carga");
        } else {
            Products = JSON.parse(xhr.response);
            res(Products);
        }
    };
});

allProducts.then(data => { //Si la promesa se cumple
    fullHTML(data);
    floatingActionB()
}).catch(function (message) {
    console.log(message);
})

function fullHTML(arr) {
    let prod = arr[0];
    let strImage = `<img src="assets/images/${prod.imagen}" alt="${prod.nombre}">`;
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
    let background = `<div class="module bg-dark-60" style="background-image:url(&quot;assets/images/${prod.imagen}&quot;);"></div>`
    document.querySelector('main').insertAdjacentHTML("beforeend", background)

    arr.forEach(e => {
        if (e.hidden == 1) {
            hidden.push(e.id)
        }
        if (e.deleted == 0) {
        let strList = `<div id=${e.id} class = "col-sm-6 col-md-3 col-lg-3">
            <p id="delete">
              <label>
                <input id=${e.id} type="checkbox" />
                <span>Delete</span>
              </label>
            </p>
            <div id=${e.id} class="switch">
              <label>
                <span>Hide</span> <br>
                Off
                <input id=${e.id} type="checkbox">
                <span class="lever"></span>
                On
              </label>
            </div>
            <a id=${e.id} class="waves-effect waves-light btn" data-toggle="modal" data-target="#edicion">Edit</a>
            <div class="shop-item-image">
            <div ><img src = "assets/images/${e.imagen}" alt = "${e.nombre}"></div>
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
        image.innerHTML = `<img src="assets/images/${dd.imagen}" alt="${dd.nombre}">`;
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
    addbasket.querySelector("span").innerText = "PEDIDO!!!"
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
    xhr.open("POST", "http://localhost:3000/api/pedido", true);
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



/********************************************************************
**********************FLOATING ACTION BUTTON*************************
*********************************************************************/
let deleteButtons
let disbleButtons
let editButtons
let saveDeleted
let saveDisabled
let cancelButton
let ptch = JSON.stringify({"deleted": 1})
let hide = JSON.stringify({"hidden": 1})
let nothidden = JSON.stringify({"hidden": 0})
let settings
let modalNew

function floatingActionB(){
    settings = document.querySelector('.fixed-action-btn')
    M.FloatingActionButton.init(settings, {
        hoverEnabled: false
    })

    modalNew = document.querySelector('#newProduct')
    M.FloatingActionButton.init(modalNew, {
        direction: 'left',
        hoverEnabled: false
    });

    //Se crean los even listeners para los botones dentro del floating action button 
    const del = document.getElementById('btn_delete')
    del.addEventListener('click', delElem)

    const hide = document.getElementById('btn_hide')
    hide.addEventListener('click', hideElem)

    const edit = document.getElementById('btn_edit')
    edit.addEventListener('click', editElem)

    const add = document.getElementById('btn_add')
    add.addEventListener('click', newElem)


    //Se obtienen todos los elementos que se utilizaran para algun tipo de edicion
    deleteButtons = document.getElementsByTagName("p")
    disbleButtons = document.getElementsByClassName("switch")
    editButtons = document.getElementsByClassName("waves-effect waves-light btn")

    //Se crean los event listeners para los botones guardar, deshabilitar y cancelar
    saveDeleted = document.getElementsByClassName("waves-effect btn delete")
    saveDeleted[0].addEventListener('click', DeletedElems)
    saveDeleted[0].style.display = "none"

    saveDisabled = document.getElementsByClassName("waves-effect btn disable")
    saveDisabled[0].addEventListener('click', DisabledElems)
    saveDisabled[0].style.display = "none"

    cancelButton = document.getElementsByClassName("waves-effect btn cancel")
    cancelButton[0].style.display = "none"
    cancelButton[0].addEventListener('click', cancelEdit)

    //Se ocultan todos los elementos para cuando se necesiten solo se muestren del tipo indicado
    for (const e of deleteButtons) {
        e.style.display = "none";
        e.addEventListener('change', changeDelete)
    }
    for (const e of disbleButtons) {
        e.style.display = "none";
        e.addEventListener('change', changeDisabled)
    }
    for (const e of editButtons) {
        e.style.display = "none";
        e.addEventListener('click', function () {
            clickEdit(e)
        })
    }

    if (hidden.length > 0) {
        let nodes = document.getElementById(hidden[0]).getElementsByTagName('*');
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName == "A") {
                nodes[i].style.display = "none"
            }
        }
    }
    if (deleted.length > 0) {
        let nodes = document.getElementById(deleted[0]).getElementsByTagName('*');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style.display = "none"
        }
    }

    //Oculta el menu de editar si el usuario no es de tipo admin
    if(localStorage.Admin == 0){
        settings.remove()
    }
    //Oculta la pestaña de login en el menu_producto
    if(localStorage.token != ''){
        document.querySelector('#login_reg').remove()
    }else{
      document.querySelector('#logout').remove()
    }
}


//Funcion que habilita los chekcboxes para poder realizar la eliminación de elementos
function delElem() {
    for (const e of deleteButtons) {
        e.style.display = "block";
    }
    saveDeleted[0].style.display = "block"
    cancelButton[0].style.display = "block"
    saveDeleted[0].classList.add("disabled")
    settings.remove()
}
//Función que habilita los botones de edición de elementos
function editElem() {
    for (const e of editButtons) {
        e.style.display = "block";
        cancelButton[0].style.display = "block"
        settings.remove()
    }
}
//Funcion que habilita los switches para el ocultar elementos 
let hiddenCount = 0

function hideElem() {
    for (const e of disbleButtons) {
        e.style.display = "block";
        let found = hidden.find(element => element == e.id);
        if (found) {
            hiddenCount++
            e.getElementsByTagName("input")[0].setAttribute("checked", "checked")
        }
    }
    saveDisabled[0].style.display = "block"
    cancelButton[0].style.display = "block"
    settings.remove()
}
//Funcion para crear nuevos elementos
function newElem() {
    const input = document.querySelector('#addPictureBtn');
    input.style.opacity = 0;
    
    newProd.addEventListener('submit', NewSubmit);
    newProd.addEventListener("change", EnableSave)

}
//Funcion para cancelar y recargar la pagina por si no se quiere realizar ningun cambio
function cancelEdit() {
    location.reload();
}

//Revisa si hay más de un elemento seleccionado y habilita el boton de eliminar
function changeDelete() {
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    if (checkboxes.length > 0) {
        saveDeleted[0].classList.remove("disabled")
    } else {
        saveDeleted[0].classList.add("disabled")
    }
}
//Revisa si hay más de un elemento seleccionado y habilita el boton de deshabilitar
function changeDisabled() {
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    if (checkboxes.length > 0 || checkboxes.length != hiddenCount) {
        saveDisabled[0].classList.remove("disabled")
    } else {
        saveDisabled[0].classList.add("disabled")
    }
}
//Abre un modal (?) para editar el elemento seleccionado
function clickEdit(e) {
    GetProductTypeDataEdit(e.id)
}
//Funcion para guardar los cambios cuando se tengan los elementos a eliminar
function DeletedElems() {
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    ValidateDelete(checkboxes)
}
//Funcion para guardar cambios sobre los elementos a deshabilitar
function DisabledElems() {
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    let ckbx = []
    for (const e of checkboxes) {
        ckbx.push(e.id)
    }
//Elementos que pasaron de hidden a activos    
    let checkbox_changed = hidden.filter(e => !ckbx.includes(e))

//Revisa los elementos que cambiaron de hidden a activos y los guarda en arreglo
    let checkbox_new = ckbx.filter(e => !hidden.includes(e))
    //Si un elemento de checkboxes esta en hidden entonces ese elemento no se tiene que mandar a actualizar
    //Si un elemento de checkboxes no esta en hidden entonces es un elemento nuevo a desactivar y se manda a actualizar
    
    if(checkbox_changed.length > 0){
        ValidateEnabled(checkbox_changed)
    }
    if(checkbox_new.length > 0){
        ValidateDisabled(checkbox_new)
    }
}



/*******************************************************
 * *******************ELIMINAR**************************
 * **************************************************** */
function ValidateDelete(id) {
    var r = confirm("Estás seguro que deseas eliminar producto(s)?");
    if (r == true) {
        for (const e of id) {
            Delete(e.id)
        }
    }
}

function Delete(id) {
    let xhr = new XMLHttpRequest();
    // DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
    // PRODUCTTYPES AHORA ES PRODUCT
    // PRODUCT AHORA ES CATEGORY
    // xhr.open('PATCH', `http://localhost:3000/producttype/${id}`, true);
    xhr.open('PATCH', `http://localhost:3000/product/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    //xhr.setRequestHeader('x-auth', `${localStorage.token}`)
    //xhr.setRequestHeader('x-user-token', `${localStorage.uToken}`);
    xhr.send(ptch);
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ": " + xhr.statusText);
        } else {
            alert(`Producto ${id} eliminado`);
            location.reload()
        }
    };
}




/*******************************************************
 * *******************DESHABILITAR**************************
 * **************************************************** */
function ValidateDisabled(id) {
    var r = confirm("Estas seguro que deseas deshabilitar producto(s)?");
    if (r == true) {
        for (const e of id) {
            Disabled(e)
        }
    }
}

function ValidateEnabled(id) {
    var r = confirm("Estas seguro que deseas habilitar producto(s)?");
    if (r == true) {
        for (const e of id) {
            Enabled(e)
        }
    }
}

function Disabled(id) {
    let xhr = new XMLHttpRequest();
    // DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
    // PRODUCTTYPES AHORA ES PRODUCT
    // PRODUCT AHORA ES CATEGORY
    // xhr.open('PATCH', `http://localhost:3000/producttype/${id}`, true);
    xhr.open('PATCH', `http://localhost:3000/product/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    //xhr.setRequestHeader('x-auth', `${localStorage.token}`)
    //xhr.setRequestHeader('x-user-token', `${localStorage.uToken}`);
    xhr.send(hide);
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ": " + xhr.statusText);
        } else {
            alert(`Producto ${id} deshabilitado`);
            location.reload()
        }
    };
}

function Enabled(id) {
    let xhr = new XMLHttpRequest();
    // DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
    // PRODUCTTYPES AHORA ES PRODUCT
    // PRODUCT AHORA ES CATEGORY
    // xhr.open('PATCH', `http://localhost:3000/producttype/${id}`, true);
    xhr.open('PATCH', `http://localhost:3000/product/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    //xhr.setRequestHeader('x-auth', `${localStorage.token}`)
    //xhr.setRequestHeader('x-user-token', `${localStorage.uToken}`);
    xhr.send(nothidden);
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ": " + xhr.statusText);
        } else {
            alert(`Producto ${id} habilitado`);
            location.reload()
        }
    };
}


/*******************************************************
 * *******************EDITAR PRODUCTO*******************
 * **************************************************** */
//Se agrega un listener paratodo el form boton del fform
let form_edit = document.querySelector('#edit')
let product_edit = []
let producttype_edit = []
//Consulta para obtener los datos del tipo de producto y luego editarlo
function GetProductTypeDataEdit(id) {
    const edit_product = new Promise((res, rej) => {
        let xhr = new XMLHttpRequest();
        // DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
        // PRODUCTTYPES AHORA ES PRODUCT
        // PRODUCT AHORA ES CATEGORY
        // xhr.open('GET', `http://localhost:3000/producttype/${id}`, true)
        xhr.open('GET', `http://localhost:3000/product/${id}`, true)
        //xhr.setRequestHeader('x-auth', `${localStorage.token}`)
        //xhr.setRequestHeader('x-user-token', `${localStorage.uToken}`)
        xhr.send();
        xhr.onload = function () {
            if (xhr.status != 200) {
                alert(xhr.status + ": " + xhr.statusText)
                rej("Error")
            } else {
                producttype_edit = JSON.parse(xhr.response)
                res(producttype_edit)
            }
        };
    })
    edit_product
        // DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
        // PRODUCTTYPES AHORA ES PRODUCT
        // PRODUCT AHORA ES CATEGORY
        // .then(producttype => {
        .then(product => {
            GetProductDataEdit(product)
        })
        .catch(message => {
            console.log(message);
        })
}

//Consulta para obtener los datos del producto y cargarlo en el tipo de producto
// DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
// PRODUCTTYPES AHORA ES PRODUCT
// PRODUCT AHORA ES CATEGORY
// function GetProductDataEdit(producttype) {
function GetProductDataEdit(product) {
    const edit_product = new Promise((res, rej) => {
        let xhr = new XMLHttpRequest();
        // xhr.open('GET', `http://localhost:3000/products/${producttype.producto}`, true)
        xhr.open('GET', `http://localhost:3000/products/${product.producto}`, true)
        //xhr.setRequestHeader('x-auth', `${localStorage.token}`)
        //xhr.setRequestHeader('x-user-token', `${localStorage.uToken}`)
        xhr.send();
        xhr.onload = function () {
            if (xhr.status != 200) {
                alert(xhr.status + ": " + xhr.statusText)
                rej("Error")
            } else {
                product_edit = JSON.parse(xhr.response)
                res(product_edit)
            }
        };
    })
    edit_product
        .then(product => {
            EditProductTypeData(product)
        })
        .catch(message => {
            console.log(message);
        })
}

    ///Funcion para abrir modal con el usuario que se quiere editar
    function EditProductTypeData(product){
        debugger
            let desc = producttype_edit.descripcion
            let p_name = product.tipo
            let id_pt = producttype_edit.id
            let pt_name = producttype_edit.nombre
            let imagen = producttype_edit.imagen
            let precio = producttype_edit.precio
            let modal_inputs = document.getElementById("edicion").querySelectorAll("input,textarea")
            for (let item of modal_inputs) {
                switch(item.id) {
                    case "nombre":
                        item.value = pt_name
                        break;
                    case "precio":
                        item.value = precio
                        break;
                    case "tipo":
                        item.value = p_name
                        break;
                    case "imagen":
                        item.value = imagen
                        break;
                    case "id":
                        item.value = id_pt
                        item.disabled = true
                        break;
                    case "edit":
                        item.value = desc
                        break;
                    default:
                        console.log("Error de dato no esperado");
                }
            }
            form_edit.addEventListener('submit', EditSubmit);
            //form_edit.addEventListener("change", EnableButton)
            form_edit.addEventListener("input", EnableButton)
            form_edit.addEventListener("click", DisableButton)
    }

    ///Event listener para los campos dentro del formulario de regristo
    function EnableButton(){
        if(form_edit.querySelectorAll(':invalid').length != 0){
            document.getElementById("disabled").disabled = true;
        }else{             
                document.getElementById("disabled").disabled = false;
            }
    };

    function DisableButton(){
        //debugger
        document.getElementById("disabled").disabled = false;
    }

    function EditSubmit(event) {
        let producto_edit = []
        let key_array = ["calificacion", "descripcion", "id_pt", "nombre", "precio", "imagen", "id","hidden", "deleted"]
        event.preventDefault();
        producto_edit.push(document.querySelector('#tipo').value)
        producto_edit.push(document.querySelector('#imagen').value)
        let i = document.querySelector('#id').value
        producto_edit.push(i)
        //Convierte ambos arreglos a un objeto para poderlo mandar en el XHR
        let product_obj = {}
        key_array.forEach((key_array, k) => product_obj[key_array] = producto_edit[k]);
        product_obj.hidden = product_edit[0].hidden
        product_obj.deleted = product_edit[0].deleted
        product_obj  = JSON.stringify(product_obj)
        ProductEdit(product_obj, i)
        
    }
    
    //Funcion PUT para la actualizacion de un usuario 
    function ProductEdit(product_obj, i){
        let xhr = new XMLHttpRequest()
    // DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
    // PRODUCTTYPES AHORA ES PRODUCT
    // PRODUCT AHORA ES CATEGORY
    // xhr.open('PUT', `http://localhost:3000/producttype/${i}`, true)
        xhr.open('PUT', `http://localhost:3000/product/${i}`, true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        //xhr.setRequestHeader('x-auth', `${localStorage.token}`)
        //xhr.setRequestHeader('x-user-token', `${localStorage.uToken}`)
        xhr.send(product_obj)
        xhr.onload = function (){
            if(xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
            }else{
                alert('Producto actualizado con exito')
                $('#registro').modal('hide')
                location.reload()

            }   
        }
    }


/*******************************************************
 * *******************CREAR PRODUCTO*******************
 * **************************************************** */
    let form_new = document.querySelector('#newProd')
       ///Event listener para los campos dentro del formulario de regristo
    function EnableSave(){
    if(form_new.querySelectorAll(':invalid').length != 0){
        document.getElementById("disabledSave").disabled = true;
    }else{             
            document.getElementById("disabledSave").disabled = false;
        }
    };

    function NewSubmit(event) {
        let producto_edit = []
        let key_array = ["tipo", "imagen", "id","hidden", "deleted"]
        event.preventDefault();
        producto_edit.push(document.querySelector('#newTipo').value)
        producto_edit.push(document.querySelector('#addPicture').value)
        producto_edit.push(document.querySelector('#id').value)
        
        //Convierte ambos arreglos a un objeto para poderlo mandar en el XHR
        let product_obj = {}
        key_array.forEach((key_array, k) => product_obj[key_array] = producto_edit[k]);
        if(product_obj.imagen == undefined){
            product_obj.imagen = "BurritoArroz.jpg"
        }
        if(product_obj.id == ""){
            product_obj.id = Math.floor(Math.random() * 100); 
        }
        product_obj.deleted = 0
        product_obj.hidden = 0
        product_obj  = JSON.stringify(product_obj)
        ProductNew(product_obj)
        
    }


     //Funcion PUT para la actualizacion de un usuario 
     function ProductNew(product_obj){
        let xhr = new XMLHttpRequest()
    // DEJO COMENTADO EL QUE ESTABA ANTES POR SI FALLA EL FIND AND REPLACE
    // PRODUCTTYPES AHORA ES PRODUCT
    // PRODUCT AHORA ES CATEGORY
        // xhr.open('POST', `http://localhost:3000/producttype`, true)
        xhr.open('POST', `http://localhost:3000/product`, true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        //xhr.setRequestHeader('x-auth', `${localStorage.token}`)
        //xhr.setRequestHeader('x-user-token', `${localStorage.uToken}`)
        xhr.send(product_obj)
        xhr.onload = function (){
            if(xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
            }else{
                alert('Producto creado con exito')
                $('#registro').modal('hide')
                location.reload()

            }   
        }
    }


