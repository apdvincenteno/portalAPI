var LocalStrategy = require('passport-local').Strategy;
// const mongoose = require("mongoose");
// const Account = mongoose.model("Account")
const Account = require('../models/Account')
var bCrypt = require('bcryptjs');
module.exports = function (passport) {

  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  },
    function (req, username, password, done) {
      console.log('email______  : ', username, "password ____ : ", password)
      Account.findOne({ 'email': username }, function (err, user) {
        if (err)
          return done(err);
        if (!user) {
          return done(null, false, req.flash('message', 'User Not found.'));
        }
        if (!isValidPassword(user, password)) {
          return done(null, req.flash('message', 'Invalid Password'));
        }
        return done(null, user);
      }
      );
    })
  );

  var isValidPassword = function (user, password) {
    bCrypt.compare(password, user.password, function (err, res) {
      if (res == false) {
        return false
      } else if (res == true) {
        return true
      }
    });

  }

}
