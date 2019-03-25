const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
var client = new OAuth2Client(googleClientId, "", "");

module.exports.getGoogleUser = code => {
  return client
    .verifyIdToken({ idToken: code, audience: googleClientId })
    .then(login => {
      var payload = login.getPayload();
      var audience = payload.aud;
      if (audience !== googleClientId) {
        throw new Error(
          "error while authenticating google user: audience mismatch: wanted [" +
          googleClientId +
          "] but was [" +
          audience +
          "]"
        );
      }
      return {
        name: payload["name"],
        pic: payload["picture"],
        google_id: payload["sub"],
        email_verified: payload["email_verified"],
        email: payload["email"],
        last_name: payload["family_name"],
        first_name: payload["given_name"],
        email_domain: payload["hd"]
      };
    })
    .then(user => {
      // console.log("google response : ", user);
      return user;
    })
    .catch(err => {
      return err
    });
};
