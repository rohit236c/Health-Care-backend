let database = require('./src/database/index');
database.onConnect(() => {

    let BlockChain = require('./src/blockChain');
    
    
    let hash = require('object-hash');
    let blockChain = new BlockChain();
    let validator = require('./src/validator');
    let PROOF = 156;

    console.log("in here");

    // if (validator.proofOfWork() === PROOF) {
        
    //     let prevHash = blockChain.lastBlock() ? blockChain.lastBlock().hash : null;
        
    // }
    blockChain.addNewTransaction("islem", "alex", 200);
    blockChain.addNewBlock(null);
    console.log("Chain: ", blockChain.chain);
});