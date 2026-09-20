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

    const user = await User.matchPassword(email, password)
    console.log(user)
    return res.redirect("/home")
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

module.exports = router;