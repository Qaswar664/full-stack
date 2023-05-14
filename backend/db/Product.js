// This is products Schema file
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    userId: String,
    company: String
    
})
// here first parameter or argument is collection or table name and second parameter is schema
module.exports = mongoose.model('products', ProductSchema)