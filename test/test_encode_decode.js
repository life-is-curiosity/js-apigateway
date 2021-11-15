const jwt = require("jsonwebtoken");
const fs = require("fs");
const private_key = fs.readFileSync("../config/local/private.pem")
const public_key = fs.readFileSync("../config/local/public.pem")
const config = require("../common/env_config");
let parse_from_redis = "{\"user_id\":10001,\"name\":\"alan\"}";
let signed = jwt.sign(JSON.parse(parse_from_redis), private_key, {
  algorithm: config.session.algorithm,
  expiresIn: config.session.expire,
});

console.log(signed);

function verify(encoded) {
  try {
    return jwt.verify(
      encoded,
      public_key,
      { algorithms: config.session.algorithm },
      function (err, decoded) {
        if (err) {
          console.log(err);
          return {
            code: 99999,
            message: "errpr",
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
}

let encoded = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMDAwMSwibmFtZSI6ImFsYW4iLCJpYXQiOjE2MzY5ODk2OTYsImV4cCI6MTYzNjk4OTg3Nn0.MUDw-1agQZiP7674CqzMc35AlNKooXlJkMRFSoMQoGIIdIF85Qyf_pLFBLtdBdZTci4BugCHovI5y_7ppcOF2g";

console.log(verify(encoded))