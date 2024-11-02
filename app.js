if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Import routers
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");


const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => console.log("Connected to database"))
  .catch(err => console.error("Database connection error:", err));
async function main() {
  await mongoose.connect(dbUrl);
}


// Set up view engine and other app settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60 // 1 day
});

store.on('error', (err) => {
  console.log('session store error', err);
})

// Set up session and flash
const sessionOptions = {
  store,
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60 // 1 day
    })
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

// Define routes
app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter);  
app.use("/", userRouter);

// Root route for testing
app.get("/", (req, res) => {
  res.send("Root route working");
});

// Catch-all route for handling 404 errors
app.all("*", (req, res, next) => {
  req.flash("error", "Page not found");
  res.status(404).redirect("/");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
