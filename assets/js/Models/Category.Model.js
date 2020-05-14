const mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    tipo:{
        type: String,
        required: true
    },
    imagen:{
        type: String,
        required: false
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

module.exports = mongoose.model('categories', categorySchema);
