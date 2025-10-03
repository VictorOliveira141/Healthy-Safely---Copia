const express = require("express");
const app = express();
const porta = 3000
const session = require('express-session');

app.use(session({
  secret: 'sua-chave-secreta',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./app/public"));

app.set("view engine", "ejs");
app.set("views","./app/views");

const rotaPrincipal = require("./app/routes/router");
app.use("/", rotaPrincipal);


app.listen(porta, ()=>{
    console.log(`Servidor online\nhttp://localhost:${porta}`);
})