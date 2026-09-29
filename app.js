require("dotenv").config()
const Blog = require("./models/blog")

const express = require("express")
const path = require("path")
const app = express()
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8000




// routes
const staticRoute = require("./routes/static")
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

// middlewares
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.join(__dirname, "public")));

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



async function startServer() {
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not configured. Set it in the hosting provider environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server started at port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Application startup failed:", error.message);
    process.exit(1);
});