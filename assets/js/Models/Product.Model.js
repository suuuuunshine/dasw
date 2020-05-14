const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    nombre:{
        type: String,
        required: true
    },
    calificacion:{
        type: Number,
        required: true
    },
    precio:{
        type: Number,
        required: true
    },
    descripcion:{
        type: String,
        required: false
    },
    imagen:{
        type: String,
        required: false
    },
    category:{
        type: String,
        required: true
    },
    hidden:{
        type: Boolean,
        required: true
    },
    deleted:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)