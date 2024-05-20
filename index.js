const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const Auth=require('./src/Routes/Auth')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");


//! setup acces control
app.use(
    cors({
      credentials: true,
      origin: true,
      methods: "GET, PUT, PATCH, POST, DELETE, UPDATE, OPTIONS",
    })
  );
//! tutup setup acces control
//! setup cookie sesion
app.use(
    cookieSession({
      name: "session",
      keys: ["testing"],
      maxAge: 24 * 60 * 60 * 1000,
    })
  );
//!tutup cookie session
//!setup cookie parser
app.use(cookieParser("testingbe"));
//!setup body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.json());

//! tutup setup body parser
//! setup validatioin errors
app.use((error, req, res, next) => {
    const status = error.status || 500;
    const data = error.data;
    res.status(status).json({  data });
});

//!setup Routes
app.use("/api",Auth)



//! set up mongoose
mongoose.set('strictQuery', true);


// IYwj3D3ZinBaFx2T
// pemanngilan mongo db tidak bisa menggunakan indihome
mongoose.connect('mongodb://localhost:27017/jajal')
    .then(() => { console.log("mongoDB connect") })
    .catch(() => console.log("MOngodb 404 not found"))

app.listen(4000, () => {
    console.log("open in browser")
})