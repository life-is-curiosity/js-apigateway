var env = process.env.NODE_ENV == undefined ? "local" : process.env.NODE_ENV;
const config = require("../config/" + env + "/system-config.json");
module.exports = config;
