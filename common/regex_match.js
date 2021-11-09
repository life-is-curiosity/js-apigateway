const regex = require("../config/regex");
const string = require("string");
module.exports =  (type) => {
  if (type === undefined || string(type).isEmpty()) {
    return undefined;
  }
  return regex[type];
};