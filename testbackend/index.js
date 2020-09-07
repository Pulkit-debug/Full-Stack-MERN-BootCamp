const express = require("express");

const app = express();

const port = 3000;


app.get("/", (req, res)=> {
    res.send("You've visited HomePage");
});

const admin = (req, res) => {
    res.send("You're in Admin mode!!");
}

// middleware are something that comes in between of the final destination and starting.

const isAdmin = (req, res, next) => {
    console.log("Yes you're admin!!");
    next();
}

const isLogged = (req, res, next) => {
    console.log("Yes you're logged in!");
    next();
}

app.get("/admin", isLogged, isAdmin, admin);

app.listen(port, ()=> {
    console.log("Server is up and running on `${port}`");
});

