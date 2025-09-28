require('dotenv').config()
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

function createToken(user) {
    const payload = {
        id : user._id,
        email : user.email,
        profileImageUrl : user.profileImageUrl,
        fullName : user.fullName,
        role : user.role
    };
    // console.log(payload)

    const token = jwt.sign(payload,secret);

    return token
}


function verifyToken(token) {
    return jwt.verify(token,secret);
}


module.exports = {
    createToken,
    verifyToken
}  