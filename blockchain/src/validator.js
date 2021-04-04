let hash = require('object-hash');


let PROOF = 2;
module.exports.validaProof = (proof) => {
    let guessHash = hash(proof);
    console.log("Hashing :", guessHash);
    return guessHash == hash(PROOF);
};

module.exports.proofOfWork = () => {
    let proof = 0;
    while (true) {
        if (!this.validaProof(proof)) {
            proof++;
        } else {
            break;
        }
    }
    return hash(proof);
};