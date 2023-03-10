const express = require('express');
const app = express();
const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const router = require('express').Router();
const cors = require('cors');
const cookie_parser = require('cookie-parser');
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};

app.use(cors(corsOptions));
app.use(cookie_parser());
// hiding database password
dotenv.config({
    path: './config.env',
})


// creating port
const PORT = process.env.PORT || 8000;


// importing DataBase
require('./DB/connection');
const User = require('./model/userScheema');

app.use(express.json());



//Middleware



// const Middleware = (req, res, next) => {
//     console.log('Middleware');

//     next();
// }



// Routing
app.use(require('./router/auth'));

if (process.env.NODE_ENV == 'production') {
    app.use(express.static("client/build"))
}


app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
})
