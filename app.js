const koa = require("koa");
const ratelimit = require("koa-ratelimit");
const redis = require("./common/redis");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const helmet = require("koa-helmet");
const apigateway_controller = require("./controller/apigateway_controller");
const app = new koa();
const config = require("./common/env_config.js");
const compress = require("koa-compress");
app.use(helmet());
app.use(bodyParser());
app.use(
  compress({
    filter: function (content_type) {
      return /text/i.test(content_type);
    },
    threshold: 1024,
    flush: require("zlib").Z_SYNC_FLUSH,
  })
);
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});
app.use(
  ratelimit({
    driver: "redis",
    db: redis.connect(),
    duration: config.rate_limit.interval_ms,
    errorMessage: "over rate limit",
    id: (ctx) => {
      let token = ctx.header.token;
      return token === undefined ? "ip:" + ctx.request.ip : "token:" + token;
    },
    max: config.rate_limit.max_requests,
    disableHeader: false,
  })
);
let router = new Router();
router.post("/", apigateway_controller.portal);
app.use(router.routes()).use(router.allowedMethods());
app.listen(process.env.PORT);
