const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // ✅ Correcting Schema usage
const {User} = require("./user")

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now // ✅ Use Date.now (without parentheses)
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

});

module.exports = mongoose.model("Review", reviewSchema);
