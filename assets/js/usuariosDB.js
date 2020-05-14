const mongoose = require('./mongodb-connect')
let mongooseEmail = require('mongoose-type-email');

let usrSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    nombre:{
        type: String,
        required: true,
    },
    apellido:{
        type: String,
        required: true,
    },
    correo:{
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    password:{
        type: String,
        select: false
    },
    telefono:{

        type: String,
        required: false,
    },
    descripcion:{
        type: String,
        required: false,
    },
    imagen:{
        type: String,
        required: false,
    },
    admin:{
        type: Number,
        required: false,
    }
})

/*********SI QUIEREN PROBAR QUE FUNCIONA*********
 *********node .\assets\js\usuariosDB.js*********
 ********************************************** */

let User = mongoose.model('usuarios', usrSchema)
module.exports = User



/*
//NEW USER

function crearUsuario(user){

    let userMongo = User(user)
    userMongo.save()
    .then((resp) =>{
        console.log(resp);
    })
    .catch((err) => {
        console.log("ERROR", err);
    })
}

let newUser = {nombre:" admin",apellido:"admin",correo:"admin@admin.com",password:"admin",telefono:null,descripcion:null,imagen:null,id:"1",admin:true}
//crearUsuario(newUser)
*/
