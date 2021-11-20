var http = require("http");
const config = require("../common/env_config");
const queryString = require("query-string");
const error_mapper = require("../enum/response_code");
module.exports = {
  request: async (
    method,
    postfix_url,
    service,
    body,
    content_type,
    user_id
  ) => {
    let options = module.exports.options_concrete(
      method,
      postfix_url,
      service,
      content_type,
      user_id
    );
    return await module.exports.http_request(options, body);
  },
  options_concrete: (method, postfix_url, service, content_type, user_id) => {
    let endpoints = config.service_endpoints;
    let options = endpoints[service];
    options["path"] = postfix_url;
    options["method"] = method;
    options["timeout"] = endpoints.timeout;
    headers = {};
    headers["Content-Type"] = content_type;
    if (user_id != undefined) {
      headers["user_id"] = user_id;
    }
    options["headers"] = headers;
    return options;
  },
  http_request: async (options, body) => {
    let method = options.method;
    method = method.toUpperCase();
    if (method === "POST") {
      return await module.exports.http_post_json(options, body);
    } else if (method === "GET") {
      return await module.exports.http_get(options, body);
    }
  },
  http_get: (options, body) => {
    return new Promise((resolve, reject) => {
      let encoded = queryString.stringify(body);
      let callback = (res) => {
        let buffers = [];
        res.on("error", reject);
        res.on("data", (buffer) => buffers.push(buffer));
        res.on("end", () => {
          let data = Buffer.concat(buffers);
          if (res.statusCode === 200) {
            resolve(JSON.parse(data.toString()));
          } else {
            reject({
              code: error_mapper.network_error.id,
              message: error_mapper.network_error.message,
              reason: buffers.toString(),
            });
          }
        });
      };
      var req = http.request(options, callback);
      req.write(encoded);
      req.end();
    });
  },
  http_post_json: (options, body) => {
    return new Promise((resolve, reject) => {
      let encoded = JSON.stringify(body);
      let callback = (res) => {
        let buffers = [];
        res.on("error", reject);
        res.on("data", (buffer) => buffers.push(buffer));
        res.on("end", () => {
          let data = Buffer.concat(buffers);
          if (res.statusCode === 200) {
            resolve(JSON.parse(data.toString()));
          } else {
            reject({
              code: error_mapper.network_error.id,
              message: error_mapper.network_error.message,
              reason: buffers.toString(),
            });
          }
        });
      };
      var req = http.request(options, callback);
      req.write(encoded);
      req.end();
    });
  },
};
