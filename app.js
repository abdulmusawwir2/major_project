if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


app.set( "view engine", "ejs" ); 
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
.then(()=>{
    console.log("connected to database") 
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

// app.get("/",(req,res)=>{
//     res.send("root working")
// })

const sessionOptions = {
  secret: 'mysupersecretcode', // make this secret more secure
  resave: false,
  saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser (User.deserializeUser());

// Set up a middleware to make flash messages available to all templates (if using EJS or another templating engine)
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

app.use("/listings",  listingRouter); 
app.use("/listings/:id/reviews", reviewRouter); 
app.use("/", userRouter);


app.listen(3000,()=>{
    console.log("server is listening")
})

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).send("Something went wrong!"); // Send a 500 status code
});


// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

