const funker = require('funker');
const express = require('express');

const app = express();


app.get("/", (req, res) => {
    funker.call("training", {x: 3,y: 5}, (err, res) => {
        console.log(err, res);
    })
    res.send("Hello World");
})

app.listen(3000, () => {
    console.log("Server running");
})
