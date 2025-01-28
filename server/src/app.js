const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes=require('./auth')


const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



app.use('/auth',authRoutes);
app.get("/", (req, res) => {
  res.send(" Haos Barbershop");
});


module.exports = app;

