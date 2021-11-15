const jwt = require("jsonwebtoken");
const config = require("../common/env_config");
const private_key = require("../common/private_key");
const public_key = require("../common/public_key");
const response_code = require("../enum/response_code");

module.exports = {
  sign: (user_info_json) => {
    return jwt.sign(user_info_json, private_key(), {
      algorithm: config.session.algorithm,
      expiresIn: config.session.expire,
    });
  },
  refresh: (user_info_json) => {
    delete user_info_json["iat"];
    delete user_info_json["exp"];
    return module.exports.sign(user_info_json);
  },
  verify: (encoded) => {
    try {
      return jwt.verify(
        encoded,
        public_key(),
        { algorithms: config.session.algorithm },
        function (err, decoded) {
          if (err) {
            console.log(err);
            return {
              code: response_code.forbidden_to_the_service.id,
              message: response_code.forbidden_to_the_service.message,
            };
          } else {
            return decoded;
          }
        }
      );
    } catch (e) {
      console.log(e)
      return {
        code: response_code.forbidden_to_the_service.id,
        message: response_code.forbidden_to_the_service.message,
      };
    }
  },
};
