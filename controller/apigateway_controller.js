global.Promise = require("bluebird");
const standard_api_format = require("../common/standard_api_format");
const rules = require("../config/api-rules.json");
const string = require("string");
const error_mapper = require("../enum/response_mapper");
const token_enum = require("../enum/token_enum");
const redis = require("../common/redis");
const http = require("../common/http");
exports.portal = async (ctx) => {
  ctx.compress = true;
  return new Promise(async (resolve) => {
    let request = standard_api_format.request(ctx.request);
    let error = error_mapper.forbidden_to_the_service;
    if (request.code === 0) {
      let data = request.data;
      let rule = rules[data.service][data.event];
      let credential = rule.credential;
      if (credential) {
        let token = ctx.header.token;
        if (token === undefined || string(token).isEmpty()) {
          ctx.body = standard_api_format.error(error);
        } else {
          token = await redis.get(token_enum.token + token);
          if (token === undefined) {
            ctx.body = standard_api_format.error(error);
          }
        }
      }
      ctx.body = await http.request(
        rule.method,
        rule.url,
        data.service,
        data.body,
        rule.content_type
      );
    } else {
      ctx.body = request;
    }
    resolve(ctx);
  });
};
