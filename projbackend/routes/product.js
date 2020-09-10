const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  removeProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getCategoryById } = require("../controllers/category");
const { isLength } = require("lodash");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

router.param("productId", getProductById);

// all actual routes

// craete route
router.post(
  "/product/create/:userId",
  //   [
  //     check("name").isLength({min: 1}).withMessage("Name is required"),
  //     // check("description").isLength({min: 1}).withMessage("Description is requried"),
  //     // check("price").isLength({min: 1}).withMessage("Price is required"),
  //     // check("category").isLength({min: 1}).withMessage("category is required"),
  //     // check("stock").isLength({min: 1}).withMessage("stock is required")
  //   ],
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//read route
router.get("/product/:productId", getProduct);

// another get route for photo
router.get("/product/photo/:productId", photo);

// Update Route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// Delete Route

router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeProduct
  );


// listing route
// everyone will be able to see this route
router.get("/products", getAllProducts);

 
router.get("/products/categories", getAllUniqueCategories);
module.exports = router;
