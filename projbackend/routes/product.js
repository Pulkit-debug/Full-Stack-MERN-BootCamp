const express = require("express");
const router = express.Router();

const { getProductById, createProduct } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getCategoryById } = require("../controllers/category");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

router.param("productId", getProductById);

// all actual routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

module.exports = router;
