require("dotenv").config();
const path = require("path");
const express = require ('express');
const {route1} = require('./routes/route1')
const {connectToDb} = require('./connection');
const cookieParser = require("cookie-parser")
const {checkUserLoginStatus} = require("./middleware/userAuth");
const { route2 } = require("./routes/route2");
const Blog = require('./modules/blog')

const app = express();
const PORT = process.env.PORT || 8001;
console.log("The env port is :", process.env.MONGO_URI)


app.set("view engine","ejs");
app.set("views",path.resolve("./views"))
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(express.static(path.resolve("./public")))

connectToDb(process.env.MONGO_URI)

app.use(checkUserLoginStatus('blog'))
app.get("/",async (req,res) => {
    try{
        const blogArray = await Blog.find({});
        return res.render("home",{
        user : req.user,
        blogs : blogArray
    })
    } catch(err) {
        return res.send({msg : err})
    }
    
});

app.use("/user",route1);

app.use("/blog",route2);

app.listen(PORT,() => {
    console.log(`<------App is listening on PORT - ${PORT}----->`)
})