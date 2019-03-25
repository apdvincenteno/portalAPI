const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// mongoose.set("useFindAndModify", false); // to remove warning on FindAndModify
const { Schema } = mongoose;

//  Create new schema for accounts
const accountSchema = new Schema({
  google_id: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  full_name: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },

  postion: {
    type: String
  },
  group_ids: [String],
  avatar: {
    type: String
  },
  token: {
    type: String
  },
  avatar: {
    type: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false }
});
//signup

accountSchema.pre("save", function (next) {
  var account = this;

  // only hash the password if it has been modified (or is new)
  if (!account.isModified("password")) return next();

  // generate a salt
  const SALT_WORK_FACTOR = 10;
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(account.password, salt, function (err, hash) {
      if (err) return next(err);
      account.password = hash;
      next();
    });
  });
});

//login
accountSchema.methods.validatePassword = password => {
  bcrypt.compare(password, hash, function (err, res) {
    // jwt.sign({ id });
    //this.tokenb
    return res;
  });
};

var Account = mongoose.model("Account", accountSchema);
module.exports = Account;