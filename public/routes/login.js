//Se agregan events listener para obtener los cambios de los forms de registro y login
//form de login

//form de registro
let form_register = document.querySelector('#register')
form_register.addEventListener('submit', RegSubmit);

//Se crean los elementos para el login.
let log_button = document.querySelector('#login_button')
let log_pass = document.querySelector('#l_password')
let log_mail = document.querySelector('#l_email')

//Se agrega un event listener a los botones para validar los campos
log_button.addEventListener('click', RegLogin)
log_mail.addEventListener('keyup', EnableLogin)
log_pass.addEventListener('keyup', EnableLogin)

//Se deshabilitan los botos de registro y login
log_button.disabled = true;
document.getElementById("register_button").disabled = true

/********************************************************************
****************FUNCIONES PARA LOGIN DEL USUARIO*********************
*********************************************************************/


//Revisa si los elementos en el password no estan vacios y habilita el boton de Login
function EnableLogin(event){
    event.preventDefault();
    if(log_mail.value != "" && log_pass.value != ""){  
        log_button.disabled = false;
        }
    else{
        log_button.disabled = true;
    }
}


 //Funcion para enviar al xhr el objeto user_login con los datos del formulario
 function RegLogin(event){
    event.preventDefault();
    let key_array = ["correo", "password"]
    let user_login = []
    let m = document.querySelector('#l_email').value
    user_login.push(m)
    user_login.push(document.querySelector('#l_password').value)
    let login_obj = {}
    key_array.forEach((key_array, i) => login_obj[key_array] = user_login[i]);
    login_obj  = JSON.stringify(login_obj)
    Login(login_obj, m)
}

//Funcion POST para obtener el token de usuario, se manda llamar una funcion para obtener
//todos los usuarios actualmente registrados, se cambia a la nueva pagina y 
//se manda llamar a la funcion que actualiza los datos de los usuarios en el HTML

function Login(login_obj, m){
    let xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/login`, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(login_obj)
    xhr.onload = function (){
        if(xhr.status != 200) {
            alert('Error. Usuario no encontrado, validar correo y contrasña')
        }else{
            const response = JSON.parse(xhr.response)
            const user = response
            localStorage.setItem('User', JSON.stringify(user.user))
            localStorage.setItem('token', user.token)
            localStorage.setItem('Admin', user.admin)
            window.location.href = './menu.html'
        }   
    }
}



/********************************************************************
**************FUNCIONES PARA CREAR UN NUEVO USUARIO******************
*********************************************************************/

///Event listener para los campos dentro del formulario de regristo
form_register.addEventListener('keyup', function (e) {
    if(form_register.querySelectorAll(':invalid').length != 0){
        document.getElementById("register_button").disabled = true;
    }else{
        if(form_register.pass2.value == form_register.pass1.value){              
            document.getElementById("register_button").disabled = false;
        }
        else if(form_register.pass1.value != "" && form_register.pass2.value != "" ){
            document.getElementById("register_button").disabled = true;
        }
    }
  });

//Function para crear el usuario que se va a enviar a backend
function RegSubmit(event) {
    let user_register = []
    let key_array = ["nombre", "apellido", "correo","password", "url","sexo", "fecha"]
    event.preventDefault();
    user_register.push(document.querySelector('#name').value)
    user_register.push(document.querySelector('#lastname').value)
    user_register.push(document.querySelector('#r_email').value)
    user_register.push(document.querySelector('#pass1').value)
    /*
    //Revisa si tiene alguna url en la imagen si no envia una cadena vacia
    if(document.querySelector('#picture').value != "")
        user_register.push(document.querySelector('#picture').value)
    else
        user_register.push("") //https://randomuser.me/api/portraits/men/8.jpg
    user_register.push(document.querySelector('input[name="sexo"]:checked').value)
    user_register.push(document.querySelector('#date').value)
    */
    //Convierte ambos arreglos a un objeto para poderlo mandar en el XHR
    let user_obj = {}
    key_array.forEach((key_array, i) => user_obj[key_array] = user_register[i]);
    user_obj  = JSON.stringify(user_obj)
    NewUser(user_obj)

  }

  //Funcion POST para la creacion de un nuevo usuario 
  function NewUser(user_obj){
    let xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/register', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(user_obj)
     
    xhr.onload = function (){
        if(xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText)
        }else{
            alert('Usuario creado con exito, por favor inicia sesión')
            localStorage.setItem('token', JSON.parse(xhr.responseText).token)
        }   
    }
}

