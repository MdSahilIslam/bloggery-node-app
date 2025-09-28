const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        console.log("File Multer",file)
        return cb(null, "./public/uploads")
    },
    filename: function(req,file,cb) {
        return cb(null, Date.now() + '-'+file.originalname)
    }
});

const uploads = multer({storage : storage});

const storage2 = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "./public/images")
    },
    filename: function (req, file, cb) {
        return cb(null, Date.now() + "-"+file.originalname)
    }
});

const uploads2 = multer({storage : storage2})

module.exports = {
    uploads,
    uploads2
};