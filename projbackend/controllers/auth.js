const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req, res) => {
  const errors = validationResult(req); // because the validation result binds with the req (documentation me likha hai)
  // checking for  the errors in the fields
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array()[0].msg,
      errorParam: errors.array()[0].param
    });
  }

  // saving user to the database
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
    const errors = validationResult(req); // because the validation result binds with the req (documentation me likha hai)

    const {email, password} = req.body;

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            errorParam: errors.array()[0].param
        });
    }

    User.findOne({email}, (err, user) => {
        if(err || !user) {
          return  res.status(400).json({
                message: "User Email does not exist!!"
            });
        };
        
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            });
        };
        // CREATING Token
            const token = jwt.sign({_id: user._id, }, process.env.SECRET);

        // putting token in cookie
        res.cookie("token", token, {expire: new Date() + 9999});

        // send response to front end
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});

    });
};

exports.signout = (req, res) => {
    res.clearCookie("token");
  res.json({
    message: "User Signout Successfully",
  });
};


// Protected Routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

// custome MiddleWares

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker) {
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: "You're not Admin, Access DENIED"
        });
    }
    next();
};
