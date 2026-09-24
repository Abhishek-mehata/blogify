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
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", staticRoute,)
app.get("/", (req, res) => {
    return res.render("home", {
        user: req.user
    })
})

app.use("/user", userRoute);


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})