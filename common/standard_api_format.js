const api_rules_engine = require("./api_rules_engine");

module.exports = {
  request: function (request) {
    return api_rules_engine(request);
  },
  error: function (error) {
    return { code: error.id, message: error.message };
  },
};
