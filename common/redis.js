const Redis = require("ioredis");
const config = require("./env_config.js");
const string = require("string");
var redis_connection;

module.exports = {
  connect: () => {
    if (redis_connection === undefined) {
      redis_connection = new Redis({
        port: config.redis.port,
        host: config.redis.host,
        password: config.redis.auth,
        db: config.redis.db,
      });
    }
    return redis_connection;
  },
  get: (key) => {
    let value = module.exports.connect().get(key);
    if (value === undefined || value == "null" || string(value).isEmpty()) {
      return undefined;
    }
    return value;
  },
  del: (key) => {
    module.exports.connect().del(key);
  },
  set: (key, value) => {
    module.exports.connect().set(key, value, "ex", config.session.expire);
  },
};
