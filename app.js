const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("./app/public"));

app.set("view engine", "ejs");
app.set("views","./app/views");

const rotaPrincipal = require("./app/routes/router");
app.use("/", rotaPrincipal);


app.listen(process.env.APP_PORT, ()=>{
    console.log(`Servidor online\nhttp://localhost:${process.env.APP_PORT}`);
})