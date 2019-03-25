var express = require('express');
var router = express.Router();
var tokenizer = require("../utils/jwt-tokenizer");
const jwt = require('jsonwebtoken');
// const mongoose = require("mongoose");
// const Account = mongoose.model("Account");
const Account = require('../models/Account');
var AccountController = require('../controllers/accountsController');
// UserController
var AuthenticationController = require('../controllers/authController');


module.exports = function (passport) {


  router.post('/signup', function (req, res, next) {
    passport.authenticate('signup', { session: true }, function (err, signup, info) {
      if (err) {
        return next(err);
      }
      if (!signup) {
        return res.status(403).send({ message: 'Email or Username already used!' });
      } else {
        return res.status(200).send(info);
      }
    })(req, res, next);
  });


  router.get('/decode', tokenizer.verifyJwtToken, function (req, res, next) {
    jwt.verify(req.token, 'mySecretKey', (err, authData) => {
      if (err) {
        // res.jsonStatus(403);
        res.status(401).send({ error: 'Please Login First!' });
      } else {
        res.json({
          message: 'Post created...',
          authData
        });
      }
    });
  });

  // router.get('/login', function (req, res) {
  //   res.render('auth/login');
  // });

  router.post('/login', function (req, res, next) {
    passport.authenticate('localstrategy', function (err, user, info) {
      console.log("info ---> : ", JSON.stringify(info), ' user : ',user);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send({ error: "Unauthorized!" });
      } else {
        req.login(user, loginErr => {
          console.log('user_________ : ', user + " __________loginERR : ", loginErr)
          if (loginErr) {
            return next(res.status(401).send({ error: "Email not verified" }));
          }
          //delete password
          user.password = 'secret :D';
          var tokeObject = {
            id:user._id,
            googleId:user.google_id,
            email:user.email
          }
          var token = jwt.sign(tokeObject, 'mySecretKey', { expiresIn: '1h' });
          var objLoginSuccess = {
            token: token,
            role: user
          }
          console.log('jwt signin --------------------------||||||||||||> :',objLoginSuccess )
          return res.json(objLoginSuccess);
        });
      }

    })(req, res, next);
  });

  router.get('/me', function (req, res) {
    if (!req.user) {
      var objMe = { message: "failed", result: "Please Login First" }
    } else {
      console.log("THIS IS MEEE-> " + req.user);
      var objMe = {
        message: "success",
        currentUser: {
          id: req.user._id,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email
        }
      }
    }
    res.json(objMe);
  });

  router.get('/profile', function (req, res) {
    if (req.user) {
      objProfile = req.user;
    } else {
      objProfile = { message: "failed", result: "Please Login First" }
    }
    res.json(objProfile);
  });

  router.get('/get-profile', function (req, res) {
    var userId = req.query.objectId;
    AuthenticationController.profile(userId, function (err, list) {
      var user = list[0];
      res.json(user);
    });
  });

  router.post('/update-profile', function (req, res) {
    var currentObjectId = req.body.currentObjectId;
    var setFieldsForUpdate = {
      'first_name': req.body.first_name,
      'last_name': req.body.last_name,
      'contact_number': req.body.contact_number
    }

    Account.update({ '_id': currentObjectId },
      {
        $set: setFieldsForUpdate
      }, function (err, result) {
        if (err) {
          obj = { message: "failed", resultMessage: "Failed to update, Please make sure you completed the form" }
        } else {
          obj = { message: "success", resultMessage: "Congratulations, Your Profile is Updated!" }
        }
        console.log("this is obj" + JSON.stringify(obj));
        res.json(obj)
      });
  });

  router.post('/forgot-password', function (req, res) {
    var email = req.body.email;
    AuthenticationController.sendResetPassword(email, function (err, list) {
      if (err) {
        res.status(404).send({ message: err });
      } else {
        res.status(200).send({ message: 'Please check your email to change your password' });
      }
    });
  });

  router.post('/update-password/:currentObjectId', function (req, res) {
    var hashPassword = AuthenticationController.makeHashPassword(req.body.password);
    Account.update({ '_id': req.params.currentObjectId },
      {
        $set: {
          password: hashPassword
        }
      }, function (err, result) {
        if (err) {
          res.status(500).send({ error: "Failed to update your password. Please Try Again" });
        } else {
          res.status(200).send({ message: "Your password is successfully updated" });
        }
      });
  });

  router.get('/logout', function (req, res) {
    if (req.user) {
      req.session.destroy();
      objLogout = { message: "success", resultMessage: "Congratulations, You have successfully logged out." }
    } else {
      objLogout = { message: "failed", resultMessage: "Failed to Logout! Make sure you're Logged in!" }
    }
    res.json(objLogout);
  });

  router.get('/all', function (req, res, next) {
    AccountController.search({ is_deleted: false }, function (error, results) {
      var response = { data: results };
      res.json(response);
    });
  });

  //get user by ID
  router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    AccountController.view(id, function (error, singleObject) {
      res.json(singleObject);
    });
  });

  //FOR UPDATING
  router.post('/:id', function (req, res, next) {
    var id = req.params.id;
    var id = req.params.id;
    let newPassword;
    if (req.body.password !== 'password') {
      newPassword = AuthenticationController.makeHashPassword(req.body.password);
      req.body.password = newPassword;
    }
    UserController.update(id, req.body, function (error, singleObject) {
      if (error) {
        res.send(error);
      }
      res.json(singleObject);
    });
  });

  //FOR DELLETING
  router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    AccountController.delete(id, { is_deleted: true }, function (error, singleObject) {
      res.send(singleObject);
    });
  });

  router.post('/veriy-email/:id', function (req, res, next) {
    var id = req.params.id;
    var data = req.body;
    AccountController.update(id, data, function (error, singleObject) {
      res.json(singleObject);
    });
  });
  //module.exports = router;
  return router;
}
