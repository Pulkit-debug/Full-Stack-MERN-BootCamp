var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name").isLength({ min: 3 }).withMessage("Name must be 3 chars long"),
    check("email").isEmail().withMessage("Not a Valid Email Address"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 chars long"),
  ],
  signup
);

// Post route for Signin
router.post("/signin", [
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({min: 3}).withMessage("Password filed, is required")
],
signin
);

router.get("/signout", signout);



module.exports = router;
