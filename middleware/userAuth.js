const {verifyToken} = require('../services/authentication')

function checkUserLoginStatus(name) {
    return (req,res,next) => {
        const token = req.cookies[name];

        if (!token) {return next()}

        try{
            const tokenData = verifyToken(token);
            req.user = tokenData
        } catch(err) {

        }

        return next()
    }
}

module.exports = {
    checkUserLoginStatus
}