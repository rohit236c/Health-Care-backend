const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BlockChainSchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    timestamp: {
        required: true,
        type: Date,
        default: Date.now()
    },
    transactions: {
        type: Array,
    },
    prevHash: {
        required: false,
        type: String
    },
    hash: {
        type: String
    },
    id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

module.exports = mongoose.model("BlockChainTwo", BlockChainSchema);