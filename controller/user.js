const user = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.postSignup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new user({ email, username });
    let registeredUser = await user.register(newUser, password);
   
    req.login(registeredUser,(err)=>{
      if(err){
        next(err)
      }
      req.flash("success", "Welcome to Wonderlust");
      res.redirect("/listings");
    })
   
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
}
module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
  }
  module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if(err){
       return next(err)
      }
      req.flash("success", "you are logged out")
      res.redirect("/listings")
    })
  }
  module.exports.login = async (req, res) => {
      req.flash("success" , "Welcome to the Wonderlust")
      let redirectUrl = res.locals.redirectUrl || "/listings"
       res.redirect(redirectUrl)
    }