const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
  user_id:{
      type: String,
      required: true,
      unique: true
  },
  products: [{
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