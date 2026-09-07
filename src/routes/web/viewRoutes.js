const express = require("express");
const router = express.Router();

const isLoggedIn = (req) => Boolean(req.cookies && req.cookies.token);

router.get("/", (req, res) => {
    if (isLoggedIn(req)) {
        return res.redirect("/dashboard");
    }

    res.render("pages/home", {
        title: "PhonePe Clone",
        isLoggedIn: false
    });
});

router.get("/login", (req, res) => {
    if (isLoggedIn(req)) {
        return res.redirect("/dashboard");
    }

    res.render("pages/login", {
        title: "Login",
        isLoggedIn: false
    });
});

router.get("/register", (req, res) => {
    if (isLoggedIn(req)) {
        return res.redirect("/dashboard");
    }

    res.render("pages/register", {
        title: "Register",
        isLoggedIn: false
    });
});

router.get("/dashboard", (req, res) => {
    if (!isLoggedIn(req)) {
        return res.redirect("/login");
    }

    res.render("pages/dashboard", {
        title: "Dashboard",
        isLoggedIn: true
    });
});

module.exports = router;
