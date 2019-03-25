// const mongoose = require("mongoose");
// const account = mongoose.model("Account")
var account = require('../models/Account')
var mod = account;

var BaseCRUD = {
  save: function (obj, callback) {
    var newObject = new mod(obj);
    newObject.save(function (err, singleObject) {
      callback(err, singleObject);
    });
  },
  search: function (search, callback) {
    account.find(search, function (err, list) {
      callback(err, list);
    });
  },
  fetchAll: function (search, callback) {
    account.find({}, function (err, list) {
      callback(err, list);
    });
  },
  view: function (id, callback) {
    account.findById(id, function (err, result) {
      callback(err, result);
    })
  },
  delete: function (id, formData, callback) {
    account.findByIdAndUpdate(id, { $set: { is_deleted: true } }, function (err, result) {
      callback(err, result);
    });
  },
  update: function (id, formData, callback) {
    account.findByIdAndUpdate(id, { $set: formData }, function (err, result) {
      callback(err, result);
    });
  }
};

module.exports = BaseCRUD;
