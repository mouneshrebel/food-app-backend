const mongoose = require('mongoose');


const ContactSchema = mongoose.Schema({
    name : String,
    email : String,
    message : String
})



module.exports = mongoose.model('ContactData', ContactSchema);