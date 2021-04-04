const mongoose = require('mongoose');
let blockchain = require('./model');

//connect

mongoose.connect("mongodb://localhost:27017/blockchain", {
    useNewUrlParser: true
}, (err) => {
    if (err) console.log(err);
    console.log("database connected!!!!");

    connectionCallback();
});

let connectionCallback = () => {

};

module.exports.onConnect = (callback) => {
    connectionCallback = callback;
}