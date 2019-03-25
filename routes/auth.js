// dependencies
const mongoose = require("mongoose");
const Account = mongoose.model("Account")
const express = require("express");
const router = express.Router();
const authConfig = require('../services/auth-config');
const Authentication = require('../services/index');
const auth = new Authentication({ routes: authConfig });



router.post("/auth/token", (req, res) => {
  try {
    const login = req.body;
    auth.authenticate(login, credentials => {
      // check if google account was already in collection
      var data = credentials.user;
      if (!data.email) {
        return res.status(401).send({
          error: "google timeout",
          messege: "Token used too late"
        });
      }
      const { email, name, pic, google_id, first_name, last_name, email_domain } = credentials.user;
      // check if google email response is @growthops.asia
      if (email_domain != "growthops.asia") {
        return res.status(403).send({
          statusCode: 403,
          message: "Please use growthops email only!"
        });
      }
      // var hashPassword = bcrypt.hashSync(req.headers.password, salt);
      var accountsFormData = { email: email },
        insert = {
          email: email,
          username: name,
          full_name: name,
          google_id: google_id,
          avatar: pic,
          first_name,
          last_name,
          password: req.headers.password
          // password:hashPassword
        };
      Account.findOne(accountsFormData, (err, userData) => {
        if (err) {
          return res.send(500, {
            statusCode: 500,
            message: "something happen internal error!"
          });
        } else if (!userData) {
          Account.create(insert, (err, newUserData) => {
            console.log('test_________ ', newUserData)
            const { email, google_id, avatar, first_name, last_name, passpword, fullname, _id } = newUserData;
            if (err) {
              console.log(err);
              return res.send(500, {
                statusCode: 500,
                message: "something happen internal error!"
              });
            } else if (newUserData) {
              console.log(newUserData);
              return res.send(200, {
                statusCode: 200,
                message: "user register save!",
                _id,
                google_id,
                email,
                last_name,
                first_name,
                fullname,
                avatar
              });
            }
          });
        } else if (userData) {
          // already exist
          return res.send(200, {
            statusCode: 200,
            message: "user already exist!"
          });
        }
      }
      );
    }).then(credentials => { });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error }).end();
  } finally {
  }
});


// router.post('/login', function (req, res, next) {
//   passport.authenticate('login', function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.sendStatus(401);
//     }
//     req.login(user, loginErr => {
//       if (loginErr) {
//         return next(loginErr);
//       }
//       var userjwt = {
//         user_type: user.userType,
//         username: user.username
//       }
//       var token = jwt.sign({ user }, 'mySecretKey', { expiresIn: '1h' });
//       // var objLoginSuccess = {
//       //   message : 'success',
//       //   authorize : 'true',
//       //   token : token,
//       //   user
//       // }
//       var objLoginSuccess = {
//         message: 'success',
//         authorize: 'true',
//         token: token
//       }
//       return res.send(objLoginSuccess);
//     });
//   })(req, res, next);
// });


module.exports = router;
