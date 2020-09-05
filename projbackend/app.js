const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();


const app = express();

mongoose.connect(process.env.DATABASE, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(()=> {
        console.log("DB Connected!!");
    });


    const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is up and running on ${port}`);
});


