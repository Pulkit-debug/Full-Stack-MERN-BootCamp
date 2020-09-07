require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/auth");

const app = express();

// DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected!!");
  });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use("/api", authRoute);

// PORT
const port = process.env.PORT || 3000;

// Starting the Server
app.listen(port, () => {
  console.log(`App is up and running on ${port}`);
});
