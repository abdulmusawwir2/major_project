const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}  = require("../middleware");


// Render signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Handle signup form submission
router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", "Signup failed: " + err.message);
        res.redirect("/signup");
    }
});

// Render login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Handle login form submission
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true 
}), (req, res) => {
    req.flash("success", "Welcome back to Wander Lust!");  
    
    // Get the redirect URL, ensuring no spaces are included
    let redirectUrl = res.locals.redirectUrl || "/listings"; // Default to "/listings" without spaces
    
    // Log the redirect URL for debugging
    console.log("Redirecting to:", redirectUrl); 

    // Redirect to the determined URL
    res.redirect(redirectUrl);
});


// Optional: Logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success", "Logged out successfully!"); // Add flash message on logout
        res.redirect("/login"); // Redirect to login page after logout
    });
});



module.exports = router;
