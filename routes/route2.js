const { Router } = require('express');
const {uploads} = require('../middleware/multer');
const Blog = require('../modules/blog');
const Comment = require('../modules/comment');
const fs = require("fs")

const route2 = Router();

route2.get("/add-new",(req,res) => {
    return res.render("blog",{
        user : req.user
    })
});

route2.post("/add-new",uploads.single("coverImage"), async (req,res) => {
    const {title,body} = req.body
    try {
        const blog = await Blog.create({
        title,
        body,
        createdBy : req.user.id,
        coverImageUrl: `/uploads/${req.file.filename}`
    });

    return res.redirect(`/blog/${blog.id}`)
    } catch(err) {
        return res.send({msg : err})
    }



})

route2.get("/myblog",async (req,res) => {
    try {
        const myBlog = await Blog.find({createdBy: req.user.id});
        return res.render("home",{
        user : req.user,
        blogs : myBlog,
        tag: "tag"
    })
    }catch(err) {
        return res.send({msg : err})
    }
    

})

route2.get("/dlt-blog/:id",async (req,res) => {
    try {
        const dlt = await Blog.findByIdAndDelete({_id : req.params.id});
        const dltCmt = await Comment.deleteMany({blogId : req.params.id});     
        fs.unlink(`./public/${dlt.coverImageUrl}`,(req,err)=> {
            console.log("Res:",req);
            console.log("err:",err)
        })
    }catch(err) {
        return res.send({msg : err})
    }

    return res.send({msg : "Deleted"})
})

route2.get("/:id" , async (req,res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        const comment = await Comment.find({blogId : req.params.id}).populate('createdBy')

        return res.render('blogBody',{
        user : req.user,
        blog : blog,
        comment : comment,
        createDate: function(date) {
            const exactDte = date.split(" ");
            return exactDte[1]+" "+exactDte[2]+" "+exactDte[3]
      }
    })
    } catch (err) {
        return res.send({msg : err})
    }


})

route2.post("/comment/:blogId",async (req,res) => {
    const {commentBody} = req.body

    try {
        const blogComment = await Comment.create({
        commentBody,
        createdBy: req.user.id,
        blogId: req.params.blogId
    });
    } catch (err) {
        return res.send({msg : err})
    }

    return res.redirect(`/blog/${req.params.blogId}`);
})



module.exports = {
    route2
}