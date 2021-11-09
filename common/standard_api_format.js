const api_rules_engine = require("./api_rules_engine");

module.exports = {
  request: (request) => {
    return api_rules_engine(request);
  },
  error: (error) => {
    return { code: error.id, message: error.message };
  },
};
