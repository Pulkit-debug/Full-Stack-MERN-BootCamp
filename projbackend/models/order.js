const mongoose = require("mongoose");
const user = require("./user");

const {ObjectId} = mongoose.Schema;


const cartProductSchema = mongoose.Schema({
product: {
    type: ObjectId,
    ref: Product
},
name: String,
quantity: {
    type: Number
},
price: Number
});

const cartProduct = mongoose.model("CartProduct", cartProductSchema);


const orderSchema = mongoose.Schema({

products: [cartProductSchema],
transactionId: {},
amount: {
    type: Number
},
address: {
    type: String
},
updated: Date,
user: {
    type: ObjectId,
    ref: User
}

}, {timestamps: true});


const order = mongoose.Schema("Order", orderSchema);


module.exports = {order, cartProduct};