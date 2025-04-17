const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // ✅ Correcting Schema usage
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email:{
        type:String,
        required : true
    }
})

    userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);