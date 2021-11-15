global.Promise = require("bluebird");
const standard_api_format = require("../common/standard_api_format");
const rules = require("../config/api-rules.json");
const string = require("string");
const error_mapper = require("../enum/response_code");
const token_enum = require("../enum/token_enum");
const redis = require("../common/redis");
const http = require("../common/http");
const jwt = require("../common/jwt_token");

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
        let key = token_enum.token + token;
        if (token === undefined || string(token).isEmpty()) {
          ctx.body = standard_api_format.error(error);
        } else {
          let encoded = await redis.get(key);
          if (encoded === undefined) {
            ctx.body = standard_api_format.error(error);
          } else {
            try {
              let decoded = jwt.verify(encoded);
              if (
                decoded.code != undefined ||
                decoded.code === error_mapper.forbidden_to_the_service.id
              ) {
                redis.del(key);
                ctx.body = standard_api_format.error(error);
              } else {
                let user_id = decoded.user_id;
                if (user_id === undefined) {
                  redis.del(key);
                  ctx.body = standard_api_format.error(error);
                } else {
                  redis.set(key, jwt.refresh(decoded));
                  ctx.body = await http.request(
                    rule.method,
                    rule.url,
                    data.service,
                    data.body,
                    rule.content_type,
                    user_id
                  );
                }
              }
            } catch (e) {
              console.log(e);
              redis.del(key);
              ctx.body = standard_api_format.error(error);
            }
          }
        }
      } else {
        ctx.body = await http.request(
          rule.method,
          rule.url,
          data.service,
          data.body,
          rule.content_type,
          undefined
        );
      }
    } else {
      ctx.body = request;
    }
    resolve(ctx);
  });
};
