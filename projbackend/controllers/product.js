const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); // requiring file system becasue wwe will have to get the path of the products
const { check, validationResult } = require("express-validator");
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found ",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  // ** This is the restrictions part here we are applying directly onto routes (Go and check the route for this) ****

  // const errors = validationResult(req);
  // if(!errors.isEmpty()) {
  //   return  res.status(422).json({
  //         error: "something up with validation"
  //     });
  // }

  // *************

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Some Problem with Image",
      });
    }

    // destructuring the fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "please provide all the required fields",
      });
    }

    let product = new Product(fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File Size Limit Exceeded",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    // save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving Tshirt in DB Failed!",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  // we are setting photo to undefined because we don't want the bulk photo to load up as this will be an extensive
  // task for the Database which will make our app slow.
  res.json(req.product);
};

// Now to handle our photo we can simply create a middleware which will runin background and make  the loading fast.

exports.photo = (req, res, next) => {
  // Just a safety check
  if (req.product.photo.data) {
    // we are going to set up some content
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// update controller

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Some Problem with Image",
      });
    }

    // updation code.
    let product = req.product;
    // now we will use lodash to get the updated values/fields
    product = _.extend(product, fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File Size Limit Exceeded",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    // save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed!",
        });
      }
      res.json(product);
    });
  });
};

// Delete Controller
exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to Delete the Product",
      });
    }

    res.json({
      message: "Deletion of Product was Successfull",
      removeProduct,
    });
  });
};

// Product Listing

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? req.query.limit : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  // this sort by line means either sort based on the parameter given from front end or sort based on _id
  Product.find()
    // in .select we are using -photo which means that we are excluding them because they can take up time to load.
    .select("-photo")
    .populate("category")
    // sorting the contents
    .sort([[sortBy, "asc"]])
    // Here we are setting the limit upto which we want to show the product list.
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product FOUND",
        });
      }
      res.json(products);
    });
};


exports.getAllUniqueCategories = (req, res) => {
  // this is the functino we use to get all the distinct categories
  Product.distinct("category", {}, (err, category) => {
    if(err) {
      return res.status(400).json({
        error: "No Category Found!"
      });
    }
     res.json(category);
  });
};


// Now we need to change stock and sell when the user buys something or like that for that we'll create seperate middlewares
// So here we are using Bulk operations provided by mongoose

exports.updateStock = (req, res, next) => {
  // here we are looping through the products in the order list and fetching them one by one to update stock and sell
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  // This is the metnod to do both the opration at same
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation Failed",
      });
    }

    next();
  });
};
