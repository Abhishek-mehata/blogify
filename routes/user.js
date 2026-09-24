const { Router } = require("express")
const User = require("../models/user");
const router = Router();

router.get("/signin", async function (req, res) {
    return res.render("signin");
});

router.get("/signup", async function (req, res) {
    return res.render("signup")
})


router.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    try {

        const token = await User.matchPasswordAndGenerateToken(email, password)
        console.log(token)
        return res.cookie("token", token).redirect("/home")
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password"
        })
    }
})

router.post("/signup", async function (req, res) {
    // console.log( req.body)
    const { fullName, email, password } = req.body;

    if (User.exists(email)) {
        // throw new Error("Email Already Exists");
    }

    await User.create({
        fullName, email, password
    });


    return res.redirect("/home")

})

router.get("/logout", (req, res) => {
    try {

        res.clearCookie("token").redirect("/");
    } catch (error) {

    }
})

module.exports = router;