const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./connection');
require('dotenv').config();
const morgan = require('morgan');
const helmet = require('helmet');

const portlocation = require('./routes/PortLocation');
const shippingDetails = require("./routes/shippingDetails");
const register = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("*", cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));


app.use('/api', portlocation);
app.use('/api', shippingDetails);
app.use('/api', register);

const port = process.env.PORT || 8000;

app.listen(port, "localhost", () => {
  console.log("process url", process.env.MONGODB_URL);
  console.log('Server is running on port', port);
  connectDB();
});
