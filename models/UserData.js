const mongoose = require('mongoose');

const UserDataSchema = mongoose.Schema({
    firstName : {
       type : String,
    },
    lastName : {
       type : String,
    },
    email : {
       type : String,
       required : true
    },
    password : {
       type : String,
       required : true
    },
    confirmPassword : {
       type : String, 
       required : true
    }, 
    image : String

})

module.exports = mongoose.model('UserData', UserDataSchema ) 