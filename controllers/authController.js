//Sample Implementation
const mongoose = require("mongoose");
const Account = mongoose.model("Account")
var tokenizer = require("../utils/jwt-tokenizer");
var bCrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var moment = require('moment');

var BaseController = require('../controllers/BaseCrudController')("Account");
//    var Controller = require('../controllers/BaseCRUDController')(model);
var AuthenticationController = {
  login: function (callback) {
    callback("IM IN LOGIN");
  },

  profile: function (req, userId, callback) {
    var userId = req.user.userId;
    var searchCriteria = { "objectId": userId };
    this.search(searchCriteria, function (err, list) {
      callback(err, list)
    });
  },

  profileById: function (userId, callback) {
    var searchCriteria = { "_id": userId };
    this.search(searchCriteria, function (err, list) {
      console.log("DATA FOR PROFILE ID--> " + JSON.stringify(list))
      callback(err, list)
    });
  },

  forgotPassword: function (email, callback) {
    var searchCriteria = { "email": email };
    this.search(searchCriteria, function (err, list) {
      callback(err, list)
    });
  },

  updateProfile: function (req, res, objectId, callback) {
    Account.findOne({ "objectId": objectId }, function (err, user) {
      if (err) return res.send(err);
      var password = req.body.password;
      user.username = req.body.username;
      user.password = createHash(password);
      user.address = req.body.address;
      user.birthdate = req.body.birthdate;
      user.contact = req.body.contact;
      user.email = req.body.email;
      user.fullname = req.body.fullname;
      user.save(function (err, result) {
        if (err) {
          obj = {
            result: "failed",
            resultMessage: "Failed to update"
          }
        } else {
          obj = {
            result: "success",
            resultMessage: "Congratulations, Profile Updated"
          }
        }
        console.log(obj);
        //return result(obj);
        return res.send(obj);
      });
    });
    var createHash = function (password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
  },

  fetchData: function (parameter, req, res, callback) {
    Account.find({ $or: [{ 'objectId': parameter }] },
      function (err, users) {
        if (!err)
          return res.send(users);
      });
  },

  getDateTime: function () {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
  },

  makeObjectId: function () {
    var objectId = "";
    var ramdomObject = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      objectId += ramdomObject.charAt(Math.floor(Math.random() * ramdomObject.length));

    return objectId;
  },

  makeHashPassword: function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  },

  sendMailVerify: function (form, objectId) {
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '',
        pass: ''
      }
    });
    // var emailTemplate = '<div style="text-decoration: underline;"><a href = "http://localhost:2000/ipostmo-auth/mail-signup/'+ objectId +'">click to verify your account101</a></div>';
    var mailOptions = {
      from: '"TGO PORTAL" <marvin.centeno@growthops.asia>', // sender address
      to: 'email,' + form.email, // list of receivers
      subject: 'Welcome ' + form.first_name + '!', // Subject line
      text: 'Register Verification', // plaintext body
      html: '<html>'
        + '<head>'
        + '<title>Manila Portal TGO</title>'
        + '<meta charset="utf-8">'
        + '<meta name="viewport" content="width=device-width, initial-scale=1">'
        + '<meta http-equiv="X-UA-Compatible" content="IE=edge" />'
        + '</head>'
        + '<body style="margin: 0 !important; padding: 0 !important;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;">'
        + '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
        + '<tr>'
        + '<td bgcolor="#ffffff" align="center" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
        + '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
        + '<tr>'
        + '<td align="center" valign="top" style="padding: 15px 0;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" >'
        + '<a href="http://autozon.com.ph/" target="_blank" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">'
        + '<img alt="Logo" src="https://s3-ap-southeast-1.amazonaws.com/autozon-assets/logo.png" width="60" height="60" border="0" style="-ms-interpolation-mode: bicubic;border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-size: 16px; margin-top: 20px;margin-bottom: -10px;width: 300px;">'
        + '</a>'
        + '</td></tr></table></td></tr>'
        + '<tr>'
        + '<td bgcolor="#ffffff" align="center" style="padding: 15px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
        + '<table border="0" cellpadding="0" cellspacing="0" width="500" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
        + '<tr><td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
        + '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
        + '<tr><td align="center" style="font-size: 32px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">Email Confirmation</td>'
        + '</tr><tr><td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">Hi there ' + form.username + '. This is to verify that you have created an account in Autozon.com. However, to fully activate and use our website you need to verify your account by clicking the buttonbelow.</td>'
        + '</tr><tr><td align="center" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
        + '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
        + '<tr><td align="center" style="padding-top: 25px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
        + '<table border="0" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
        + '<tr><td align="center" style="border-radius: 3px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"bgcolor="#f17510"><a href="http://localhost:4200/#/login?is_verified=true&id=' + objectId + '"  style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration:none; color: #ffffff; text-decoration: none; border-radius: 3px; padding: 15px 25px; border: 1px solid #f17510;' + 'display: inline-block;">verify here</a></td>'
        + '</tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr><tr>'
        + '<td bgcolor="#ffffff" align="center" style="padding: 20px 0px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
        + '<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 500px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
        + '</table></td></tr></table></body></html>' // html body
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  },

  sendResetPassword: function (email, callback) {
    this.search({ "email": email }, function (err, list) {
      if (!list || !list.length) {
        callback('Email not found!');
      } else {
        var objectId = list[0]._id;
        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: '',
            pass: ''
          }
        });
        var emailTemplate = '<html><head>'
          + '<title>Change Password</title>'
          + '<meta charset="utf-8">'
          + '<meta name="viewport" content="width=device-width, initial-scale=1">'
          + '<meta http-equiv="X-UA-Compatible" content="IE=edge" />'
          + '</head>'
          + '<body style="margin: 0 !important; padding: 0 !important;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;">'
          + '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
          + '<tr>'
          + '<td bgcolor="#ffffff" align="center" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
          + '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
          + '<tr>'
          + '<td align="center" valign="top" style="padding: 15px 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
          + '<a href="/" target="_blank" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">'
          + '<img alt="Logo" src="" style="-ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none;display: block; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-size: 16px;margin-top: 20px;margin-bottom: -10px;width: 300px;"  border="0">'
          + '</a>'
          + '</td>'
          + '</tr>'
          + '</table>'
          + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td bgcolor="#ffffff" align="center" style="padding: 15px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
          + '<table border="0" cellpadding="0" cellspacing="0" width="500" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
          + '<tr>'
          + '<td style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
          + '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
          + '<tr>'

          + '<td align="center" style="font-size: 32px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">Forgot Password</td>'
          + '</tr>'
          + '<tr>'
          + '<td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;mso-table-lspace: 0pt; mso-table-rspace: 0pt;">Hi there ' + email + '. It seems you have forgotten your password in your account. You can set new password by clicking the button below. However if you did not request for this, kindly disregard this email. Thank you.</td>'
          + '</tr>'
          + '<tr>'
          + '<td align="center" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
          + '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
          + '<tr>'
          + '<td align="center" style="padding-top: 25px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
          + '<table border="0" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
          + '<tr>'
          + '<td align="center" style="border-radius:3px;-webkit-text-size-adjust:100%; -ms-text-size-adjust: 100%;mso-table-lspace: 0pt; mso-table-rspace: 0pt;" bgcolor="#f17510">'
          + '<a href="http://localhost:4200/#/update-password?userId=' + objectId + '" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration:none; color: #ffffff; text-decoration: none; border-radius: 3px; padding: 15px 25px;border: 1px solid #f17510; display: inline-block;">set new password</a></td>'
          + '</tr>'
          + '</table>'
          + '</td>'
          + '</tr>'
          + '</table>'
          + '</td>'
          + '</tr>'
          + '</table>'
          + '</td>'
          + '</tr>'
          + '</table>'
          + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td bgcolor="#ffffff" align="center" style="padding: 20px 0px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;mso-table-lspace: 0pt; mso-table-rspace: 0pt;">'
          + '<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 500px;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;border-collapse: collapse !important;">'
          + '<tr>'
          + '<td align="center" style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">Unit 14 Ground Floor, East of Galeria Building, Topaz Rd, San Antonio, Pasig, Metro Manila'
          + '<br>'
          + '<a href="#" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;color: #666666; text-decoration: none;">autozone_ph@autozoneph.com</a>'
          + '<span style="font-family: Arial, sans-serif; font-size: 12px; color: #444444;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>'
          + '<a href="#" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;color: #666666; text-decoration: none; ">View this email in your browser</a>'
          + '</td>'
          + '</tr>'
          + '</table>'
          + '</td>'
          + '</tr>'
          + '</table>'
          + '</body>'
          + '</html>';
        var mailOptions = {

          from: '"TGO portal" <marvin.centeno@growthops.asia>', // sender address
          to: 'email,' + email, // list of receivers
          subject: 'Welcome to Portal!', // Subject line
          text: 'TGO portal Verification', // plaintext body
          html: emailTemplate // html body
        };
        transporter.sendMail(mailOptions, function (error, info) {
          console.log('Message sent for forgot password: ' + info.response);
        });
        callback(err, list);
      }
    });
  }
};

//var CustomController = Object.create(MyOwnController); //create copy
AuthenticationController.__proto__ = BaseController;
//MyOwnController.find("Sample Custom controller");
module.exports = AuthenticationController;
