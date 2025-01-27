const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get("/", (req, res) => {
  res.send("Serverul functioneazz! Bine ai venit la Haos Barbershop API.");
});

module.exports = app;


app.get("/barbers",(req,res)=>{
    res.send("Ceva mesaj de controll");
})