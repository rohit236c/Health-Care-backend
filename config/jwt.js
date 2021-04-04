const jwt = require('jsonwebtoken');
const asyncHandler = require("../async");
exports.generateToken = ((obj) => {
    const token =  jwt.sign({
        data: obj,
    }, 'secret', {
        expiresIn: '1h'
    });
    return token;
});