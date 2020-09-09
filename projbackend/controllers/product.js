const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); // requiring file system becasue wwe will have to get the path of the products

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
  let form = new formidable.IncomingForm();
  form.keepExtensions = ture;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Some Problem with Image",
      });
    }

    //TODO: restrictions on Fields
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
