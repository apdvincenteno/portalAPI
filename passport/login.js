var LocalStrategy = require('passport-local').Strategy;
// const mongoose = require("mongoose");
// const Account = mongoose.model("Account")
const Account = require('../models/Account')
var bCrypt = require('bcryptjs');
module.exports = function (passport) {

  passport.use('localstrategy', new LocalStrategy({
    passReqToCallback: true
  },
    function (req, username, password, done) {
      console.log('email______  : ', username, "password ____ : ", password)
      Account.findOne({ 'email': username }, function (err, userResult) {
        if (err){
          return done(err);
        }else if (!userResult) {
          console.log('User not found!!!!!!!')
          return done(null, false, req.flash('message', 'User Not found.'));
        }else if(userResult){
          var isValidPassword = bCrypt.compareSync(password, userResult.password); 
          if (isValidPassword == false) {
            console.log('password is wrong!')
            return done(null, false, req.flash('message', 'Invalid Password'));
          } else if(isValidPassword == true) {
            console.log('password is correct!')
            return done(null, userResult);
          }
        }
      });
    })
  );
}
