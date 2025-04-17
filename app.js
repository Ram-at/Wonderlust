if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const { isLoggedIn } = require("./middlewares/middleware.js");

// Database Connection
  let db_url = process.env.ATLASDB_LINK;
async function main() {
  await mongoose.connect(db_url);
  console.log("Connected successfully to MongoDB");
}
 
main().catch(err => {
  console.error("Database connection error:", err);
  process.exit(1);
});

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const store = MongoStore.create({
  mongoUrl: db_url,
  crypto:{
    secret:process.env.SECRET_CODE
  },
  touchAfter: 24*3600
})
store.on("error", ()=>{
  console.log("Error in the mongo session " , err)
})

// Session Configuration
const sessionOptions = {
  store:store,
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: true,
  
};
 


app.use(session(sessionOptions));
app.use(flash());

// Passport Authentication Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages and Current User Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



// Router Imports
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Error Handling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Server Startup
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});