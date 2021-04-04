let BlockChain = require('../blockchain/src/blockChain');
let validator = require('../blockchain/src/validator');
const asyncHandler = require("../async");

exports.blockchain = asyncHandler ( async(req,res,next) => {
    let user = await User.findById(req.body.id);
    let proof = req.body.secret;
    let blockChain = new BlockChain();
    await blockChain.addNewBlock(null,user._id, proof);

    res.status(201).json({
        success: true,
        message: "Document uploaded successfully!",
    });
});