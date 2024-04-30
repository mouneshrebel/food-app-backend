const mongoose = require('mongoose');


const ProductSchema = mongoose.Schema({
    name : String,
    category : String, 
    image : String,
    price : String,
    description : String
})

module.exports = mongoose.model('Product', ProductSchema)