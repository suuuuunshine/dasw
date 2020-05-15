let allProducts = new Promise((res, rej) => { //Manda llamar a todos los productos

    let xhr = new XMLHttpRequest();
    if(localStorage.page){
        xhr.open('GET', `http://localhost:3000/api/products?page=${localStorage.page}`, true);
    }else{
        xhr.open('GET', `http://localhost:3000/api/products`, true);
    }
    //xhr.setRequestHeader("", "");
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

let main = document.querySelector('#cont');
let Products = [];
let actualPage = 1;
let numWindows = 1;
let hidden = []
let deleted = []

allProducts.then(function (data) { //Si la promesa se cumple llena un arreglo local con la lista de productos recibida

    actualPage = data.pagina;
    numWindows = data.ventanas;
    data.productos.forEach(prod => {
        Products.push(prod);
    });
    
    fullHTML(Products);
    floatingActionB()

}).catch(function (message) {
    console.log(message);
})


function fullHTML(arr) {
    let BreakException = {};
    arr.forEach(e => {
        if (e.deleted == 0) {
            if (e.hidden == 1) {
                hidden.push(e.id)
            }
            let strList = `
            <div id=${e.id} class="shop-item col-sm-6 col-md-4 col-lg-4 ">
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
              <div onclick="ldID(${e.id})" class="shop-item-image"><img src="assets/images/${e.imagen}" alt="${e.tipo}" />
                <div class="shop-item-detail">
                  <a class="btn btn-round btn-b"><span>Ver opciones</span></a>
                </div>
              </div>
              <h4 class="shop-item-title font-alt">${e.tipo}</a></h4>
          </div>`;
            main.insertAdjacentHTML("beforeend", strList);
        } else {
            console.log("Si esta eliminado");
        }
    }); 

    let str4pages = "";
    let left = parseInt(actualPage)-1;
    let right = parseInt(actualPage)+1;

    for(let x = 0; x<=numWindows; x++){
        if(x==0){
            if(actualPage!=1){
                str4pages+= `<a onclick="changePage(${left})"><i class="fa fa-angle-left"></i></a>`;
            }
        }else if(x==actualPage){
            str4pages+=`<a class="active" onclick="changePage(${x})">${x}</a>`;
        }else{
            str4pages+=`<a onclick="changePage(${x})">${x}</a>`;
        }
        if(x==numWindows){
            if(actualPage!=numWindows){ 
                str4pages+=`<a onclick="changePage(${right})"><i class="fa fa-angle-right"></i></a>`;
            }
        }
    }
    document.querySelector('div .pagination').innerHTML = str4pages;
}

function ldID(id) {
    localStorage.ventanaID = id;
    window.location.href = "./menu_producto.html"
}

function changePage(page){
    if(page==0)page=1;
    if(page>numWindows)page=numWindows;
    console.log(page);
    localStorage.page=page;
    window.location.href = "/menu.html"
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
    let ptch = JSON.stringify({"deleted": true})
    let hide = JSON.stringify({"hidden": true})
    let nothidden = JSON.stringify({"hidden": false})
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

    for (var j = 0; j < hidden.length; j++) {
        let nodes = document.getElementById(hidden[j]).getElementsByTagName('*');
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName == "A") {
                nodes[i].style.display = "none"
            }
        }
    }
    for (var j = 0; j < deleted.length; j++) {
        let nodes = document.getElementById(deleted[j]).getElementsByTagName('*');
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
    GetProductDataEdit(e.id)
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
    var r = confirm("Estas seguro que deseas eliminar producto(s)?");
    if (r == true) {
        for (const e of id) {

            Delete(e.id)
        }
    }
}

function Delete(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('PATCH', `http://localhost:3000/products/${id}`, true);
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
    xhr.open('PATCH', `http://localhost:3000/products/${id}`, true);
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
    xhr.open('PATCH', `http://localhost:3000/products/${id}`, true);
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

//Consulta para obtener los datos del producto y luego editarlo
function GetProductDataEdit(id) {
    const edit_product = new Promise((res, rej) => {
        let product_edit = []
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:3000/api/products/${id}`, true)
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
        .then(data => {
            EditProductData(data)
        })
        .catch(message => {
            console.log(message);
        })
}

    ///Funcion para abrir modal con el usuario que se quiere editar
    function EditProductData(usr_data_edit){
        usr_data_edit.map(function(key, i){
            let tipo = key.tipo;
            let imagen = key.imagen
            let id = key.id
            let modal_inputs = document.getElementById("edicion").getElementsByTagName("input")
            for (let item of modal_inputs) {
                switch(item.id) {
                        case "tipo":
                        item.value = tipo
                        break;
                    case "imagen":
                        item.value = imagen
                        break;
                    case "id":
                        item.value = id
                        item.disabled = true
                        break;
                    default:
                        console.log("error de dato no esperado");
                }
            }

        })
        form_edit.addEventListener('submit', EditSubmit);
        form_edit.addEventListener("change", EnableButton)
    }

    ///Event listener para los campos dentro del formulario de regristo
    function EnableButton(){
        if(form_edit.querySelectorAll(':invalid').length != 0){
            document.getElementById("disabled").disabled = true;
        }else{             
                document.getElementById("disabled").disabled = false;
            }
    };

    function EditSubmit(event) {
        let producto_edit = []
        let key_array = ["id", "tipo", "imagen","hidden", "deleted"]
        event.preventDefault();
        producto_edit.push(document.querySelector('#tipo').value)
        producto_edit.push(document.querySelector('#imagen').value)
        let i = parseInt(document.querySelector('#id').value)
        producto_edit.push(i)
        //Convierte ambos arreglos a un objeto para poderlo mandar en el XHR
        let product_obj = {}
        key_array.forEach((key_array, k) => product_obj[key_array] = producto_edit[k]);
        product_obj.hidden = false
        product_obj.deleted = false
        product_obj  = JSON.stringify(product_obj)
        ProductEdit(product_obj, i)
    }
    
    //Funcion PUT para la actualizacion de un usuario 
    function ProductEdit(product_obj, i){
        let xhr = new XMLHttpRequest()
        xhr.open('PUT', `http://localhost:3000/api/products/${i}`, true)
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
        xhr.open('POST', `http://localhost:3000/products`, true)
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

