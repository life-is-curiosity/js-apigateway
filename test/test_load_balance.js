const load_balance = require("../common/load_balance");
const config = require("../common/env_config");
let endpoints = config.service_endpoints;
let service_map = load_balance.build_server_map("user", endpoints.user);
let result_map = {};
for (let i = 0 ; i < 20000 ; i ++) {
  let service = load_balance.get_load_balanced_endpoint("user", service_map["user"]);
  if (result_map[service] === undefined) {
    result_map[service] = 1
  } else {
    result_map[service] = result_map[service] + 1;
  }
}
console.log(result_map)
service_map = load_balance.build_server_map("account", endpoints.account);
 result_map = {};
for (let i = 0 ; i < 20000 ; i ++) {
  let service = load_balance.get_load_balanced_endpoint("account", service_map["account"]);
  if (result_map[service] === undefined) {
    result_map[service] = 1
  } else {
    result_map[service] = result_map[service] + 1;
  }
}
console.log(result_map)