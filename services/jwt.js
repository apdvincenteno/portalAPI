var jwt = require("jsonwebtoken");

const secret = process.env.APP_SECRET;
module.exports.verify = token => {
  // console.log("TOKEN TOKENT TOKEN " , token)
  return jwt.verify(token, secret);
};

module.exports.generateToken = user => {
  return jwt.sign(
    {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    secret
  );
};
