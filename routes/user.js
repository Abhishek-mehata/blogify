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
        return res.cookie("token", token).redirect("/")
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password"
        })
    }
})

router.post("/signup", async function (req, res) {
    // console.log( req.body)
    const { fullName, email, password } = req.body;

    try {
        const existingUser = await User.exists({ email });
        if (existingUser) {
            return res.status(409).render("signup", {
                error: "An account with this email already exists."
            });
        }

        await User.create({ fullName, email, password });
        return res.redirect("/");
    } catch (error) {
        const duplicateEmail = error.code === 11000;
        console.error("Signup failed:", error.message);
        return res.status(duplicateEmail ? 409 : 500).render("signup", {
            error: duplicateEmail
                ? "An account with this email already exists."
                : "Unable to create your account. Please try again."
        });
    }
})

router.get("/logout", (req, res) => {
    try {

        res.clearCookie("token").redirect("/");
    } catch (error) {

    }
})

module.exports = router;