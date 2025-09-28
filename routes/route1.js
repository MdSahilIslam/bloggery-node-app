const {Router} = require('express');
const User = require('../modules/user');
const { verifyToken } = require("../services/authentication");
const { uploads2 } = require("../middleware/multer")


const route1 = Router();

route1.get("/signin",(req,res) => {
    return res.render('signin');
})

route1.get("/signup",(req,res) => {
    return res.render("signup")
});

route1.post('/signup',uploads2.single("profileIamge"),async(req,res) => {
    const {fullName,email,password} = req.body;
    // console.log("Body",req.file)
    try {
         const user = await User.create({
        fullName,
        email,
        password,
        profileImageUrl : `/images/${req.file.filename}`
    });
    }catch (err){
        return res.send({msg:err})
    }
   

    return res.redirect('/')
});

route1.post('/signin', async (req,res) => {
    const {email,password} = req.body;
    try {
        const token = await User.matchPasswordAndGetToken(email,password);
        // console.log("User : ", user)
        const verify = verifyToken(token)
        // console.log("Verify token : ",verify)
        return res.cookie('blog',token).redirect('/')
    } catch(err) {
        return res.render('signin',{
            error : err
        })
    }
    
});

route1.get("/logout",(req,res) => {
    return res.clearCookie('blog').redirect("/")
})


module.exports = {route1}