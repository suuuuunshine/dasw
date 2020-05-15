const mongoose = require('mongoose')

let pastOrderSchema = mongoose.Schema({
    user:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fecha:{ 
        type : Date, 
        default: Date.now 
    },
    products: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      }],
    total:{
        type: Number,
        required: true,
    }
})



module.exports =  mongoose.model('pastOrders', pastOrderSchema)
