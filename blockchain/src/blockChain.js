let hash = require('object-hash');
const TARGET_HASH = hash(2);
const asyncHandler = require('../../async');
const validator = require('./validator');
const BlockChainModel = require('./database/model');
const BlockChainModelTwo = require('./database copy/model');
const chalk = require('chalk');

class BlockChain {

    constructor() {


        this.chain = [];
        this.curr_transaction = [];
    }
    getLastBlock(cb) {
        return BlockChainModel.findOne({}, null, {
            sort: {
                _id: -1
            },
            limit: 1
        }, (err, block) => {
            if (err) return console.log(err);

            cb(block);
        });
    }
    getLastBlock2(cb) {
        return BlockChainModelTwo.findOne({}, null, {
            sort: {
                _id: -1
            },
            limit: 1
        }, (err, block) => {
            if (err) return console.log(err, "kya hua");

            cb(block);
        });
    }
    addNewBlock = asyncHandler( async(prevHash, id, secret) => {
        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            hash: null,
            prevHash: prevHash,
            secret: secret
        };
        
        if (validator.proofOfWork() === TARGET_HASH) {
            block.hash = hash(block);
            console.log("here", secret);
            block.id = id;
            this.getLastBlock2(async(lastblock) => {
                if (lastblock) {
                    console.log("here1", secret);
                    block.prevHash = lastblock.hash;
                } 
                let newBlockChain = new BlockChainModelTwo(block);
                console.log("NEW", block);
                newBlockChain.save((err) => {
                    if (err) return console.log(chalk.red("cannot save"));

                    console.log(chalk.green("Block saved on DB2"));
                });
               
                this.getLastBlock((lastblock2) => {
                    if (lastblock2) {
                        block.prevHash = lastblock2.hash;
                    }
                    let newBlockChain = new BlockChainModel(block);
                    newBlockChain.save((err) => {
                        if (err) return console.log(chalk.red("cannot save"));
    
                        console.log(chalk.green("Block saved on DB"));
                    });
                });
            });
            
        }
    })
    addNewTransaction(sender, recipient, amount) {
        this.curr_transaction.push({
            sender,
            recipient,
            amount
        });
    }
    isEmpty() {
        return this.chain.length == 0;
    }
    lastBlock() {
        return this.chain.slice(-1)[0];
    }

};

module.exports = BlockChain;