const Blog = require("../models/blog")
const Comment = require("../models/comment");

const express = require("express")
const router = express.Router();
const path = require("path")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // const uploadPath = path.join(__dirname, "../public/uploads", req.user._id.toString());
        const uploadPath = path.join(__dirname, "../public/uploads");
        return callback(
            null,
            uploadPath
        );
    },
    filename: function (req, file, callback) {
        const filename = `${Date.now()}-${file.originalname}`;
        return callback(
            null,
            filename
        )
    }
});

const upload = multer({ storage: storage });


router.get("/add-new", (req, res) => {
    return res.render("addblog", {
        user: req.user
    });
});

router.get("/:id", async (req, res) => {
    // const blog = await Blog.findById(req.params.id).populate("createdBy");// .populate will give the user object
    const blog = await Blog.findById(req.params.id)
        .populate("createdBy"); // Replaces the createdBy ObjectId with the actual User document
    // console.log(blog)


    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    console.log("comments", comments)
    return res.render("blog", {
        user: req.user,
        blog: blog,
        comments: comments
    })
})



router.post("/", upload.single('coverImage'), async (req, res) => {
    // console.log(req.body)
    // console.log(req.file)

    try {
        const { title, body } = req.body
        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageUrl: `/uploads/${req.file.filename}`
        });

        return res.redirect(`/blog/${blog._id}`);

    } catch (error) {

    }
    return res.redirect("/");
})


router.post("/comment/:blogId", async (req, res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });


    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router