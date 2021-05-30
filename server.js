const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {
    generateToken
} = require("./config/jwt");
const app = express();
const cors = require('cors');
const multer = require('multer');
let BlockChain = require('./blockchain/src/blockChain');
let validator = require('./blockchain/src/validator');

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(morgan(':method :url :status :response-time ms'));
mongoose
    .connect('mongodb://localhost:27017/health-care', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("SUCCESSFULLY CONNECTED TO DB");
    })
    .catch(() => {
        console.log("ERROR CONNECTING TO DB");
    });
const userRoutes = require("./routes/auth");
const docRoutes = require("./controllers/documents");
app.use('/public', express.static('public'));

app.use("/", userRoutes);
app.use("/users/", docRoutes);



app.listen('8000', () => {
    console.log("Server is running at: 8000");
});