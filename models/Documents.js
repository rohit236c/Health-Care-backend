const mongoose = require("mongoose");
const { schema } = require("./users");
const Schema = mongoose.Schema;
// Create Schema
const DocumentSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref:"Users"
    },
    img : {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    secret: {
        type: String,
    }
});
module.exports = mongoose.model("Documents", DocumentSchema);