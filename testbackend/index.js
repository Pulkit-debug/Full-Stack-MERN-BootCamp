const express = require("express");

const app = express();

const port = 3000;

app.get("/", (req, res)=> {
    res.send("You've visited HomePage");
});


app.listen(port, ()=> {
    console.log("Server is up and running on `${port}`");
});

