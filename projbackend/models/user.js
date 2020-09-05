const mongoose = require("mongoose");

const crypto = require("crypto");

const { v1: uuidv1 } = require('uuid');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true
    },

    lastname: {
        type: String,
        maxLenght: 32,
        trim: true   
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    userinfo: {
        type: String,
        trim: true
    },

    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {     
        type: Number,
        default: 0
    },

    purchases: {
        type: Array,
        default: [ ]
    }

}, {timestamps: true});

// creating virtual fieldds

userSchema.virtual("password") 
    // setting up the password
    .set(function(password) {
        // in java script _ is used to make the variable private
        this._password = password;
        // now I have to populate salt
        this.salt = uuidv1();
        this.encry_password = securePassword(password);
    })
    .get(function() {
        return this._password;
    });


// creating method for encrypting password
userSchema.method = {
    // we have to authenticate user
    authenticate: function(plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password;
    },

    securePassword: function(plainpassword) {
        if(!plainpassword) return "";
        try {

            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');

        } catch (err) {
            return "";
        }
    }
}



module.exports = mongoose.model("User ", userSchema);