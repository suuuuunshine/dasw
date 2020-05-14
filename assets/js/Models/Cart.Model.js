const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
  user_id:{
      type: Number,
      required: true,
      unique: true
  },
  productos: [{
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
  total:{
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('carts', cartSchema)