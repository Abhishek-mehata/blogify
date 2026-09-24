const express = require("express")
const router = express.Router();


router.get("/home", (req, res) => {
    return res.render("home", {
        user: req.user
    })
})

router.get("/", (req, res) => {
    return res.render("home", {
        user: req.user
    })
})

module.exports = router