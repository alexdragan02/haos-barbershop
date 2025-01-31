const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes=require('./routes/authRoutes');
const serviceRoutes=require('./routes/serviceRoutes');
const packageRoutes=require('./routes/packageRoutes');
const appointmentRoutes=require('./routes/appointmentRoutes');
const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



app.use('/auth',authRoutes);
app.use('/services',serviceRoutes);
app.use('/package',packageRoutes);
app.use('/appointments',appointmentRoutes);

app.get("/", (req, res) => {
  res.send(" Haos Barbershop");
});


module.exports = app;

