// This is SignUP Schema file
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})
// here first parameter or argument is collection or table name and second parameter is schema
module.exports = mongoose.model('users', UserSchema)