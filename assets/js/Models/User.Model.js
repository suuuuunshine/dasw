const mongoose = require('mongoose')
let mongooseEmail = require('mongoose-type-email');

let userSchema = mongoose.Schema({
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


module.exports = mongoose.model('User', userSchema)


