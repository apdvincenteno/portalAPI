var login = require("./login");
// var signup = require("./signup");
const mongoose = require("mongoose");
const Account = mongoose.model("Account")
var tokenizer = require("../utils/jwt-tokenizer");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {


    console.log("serializing user: ");
    console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    console.log('id test ________ : ', id)
    Account.findById(id, function (err, user) {
      if (err) {
        next(err);
      }
      user.token = tokenizer.sign(user);
      done(err, user);
    });
  });

  login(passport);
  // signup(passport);
};
