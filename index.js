const Blog = require("./models/blog")

const express = require("express")
const path = require("path")
const app = express()
const PORT = 8000
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


// connect db
mongoose.connect("mongodb://127.0.0.1:27017/blogify")
    .then((e) => {
        console.log("Mongodb Conected Successfully")
    }).catch((e) => {
        console.log("Database connection failed")
    });


// routes
const staticRoute = require("./routes/static")
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

// middlewares
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use("/", staticRoute,)
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ "createdAt": -1 });
    console.log(allBlogs)
    return res.render("home", {
        user: req.user,
        blogs: allBlogs
    })
});


app.use("/user", userRoute);
app.use("/blog", blogRoute);



app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})