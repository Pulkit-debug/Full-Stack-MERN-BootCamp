const mongoose = require("mongoose");
const category = require("./category");

const {ObjectId} = mongoose.Schema

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxLength: 32
    },
    // Every single T-shirt is going to have a category so we need to bring up the category
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    }

}, {timestamps: true});


module.exports = mongoose.Schema("Product", productSchema);  