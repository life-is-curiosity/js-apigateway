const fs = require('fs');
var env = process.env.NODE_ENV == undefined ? "local" : process.env.NODE_ENV;
module.exports = () => {
  return fs.readFileSync("config/" + env + "/private.pem");
}
