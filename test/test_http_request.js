const http = require("../common/http");
function test_http_get() {
  return new Promise((resolve, reject) => {
    let response = http.request(
      "GET",
      "/account/profile",
      "user",
      {},
      "application/json"
    );
    resolve(response);
  });
}
function test_http_post() {
  return new Promise((resolve, reject) => {
    let response = http.request(
      "POST",
      "/account/login",
      "user",
      {},
      "application/json"
    );
    resolve(response);
  });
}

(async () => {
  try {
    console.log(await test_http_get());
    console.log(await test_http_post());
  } catch (e) {
    console.log(e);
  }
})();
