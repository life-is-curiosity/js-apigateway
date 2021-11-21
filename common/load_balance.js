const config = require("../common/env_config");
var service_map = {};
var weight_map = {};
module.exports = {
  get_service: (service) => {
    let endpoints = config.service_endpoints;
    let timeout = endpoints.timeout;
    let service_array = endpoints[service];
    let length = service_array.length;
    try {
      if (length <= 0) {
        throw err;
      }
    } catch (err) {
      return undefined;
    }
    let endpoint_json = {};
    if (length == 1) {
      endpoint_json = service_array[0];
    } else {
      if (Object.keys(service_map).length == 0) {
        service_map = module.exports.build_server_map(service, service_array);
      }
      endpoint_json = module.exports.return_options_format(
        module.exports.get_load_balanced_endpoint(service, service_map[service])
      );
      endpoint_json["timeout"] = timeout;
    }
    return endpoint_json;
  },
  build_server_map: (service, service_array) => {
    let load_balances_endpoints = service_array;
    let load_balances_endpoints_map = {};
    for (let i = 0; i < load_balances_endpoints.length; i++) {
      let url =
        load_balances_endpoints[i].hostname +
        ":" +
        load_balances_endpoints[i].port;
      let weight = load_balances_endpoints[i].weight;
      load_balances_endpoints_map[url] = weight;
    }
    service_map[service] = load_balances_endpoints_map;
    return service_map;
  },
  get_load_balanced_endpoint: (service, service_map_endpoints) => {
    if (
      Object.keys(weight_map).length > 0 &&
      weight_map[service] != undefined
    ) {
      return weight_map[service].server_list[
        Math.floor(Math.random() * weight_map[service].weight_sum)
      ];
    } else {
      let server_list = [];
      let server_set = Object.keys(service_map_endpoints);
      let weight_sum = 0;
      for (let i = 0; i < server_set.length; i++) {
        let server = server_set[i];
        let weight = service_map_endpoints[server];
        weight_sum += weight;
        for (let j = 0; j < weight; j++) {
          server_list.push(server);
        }
      }
      weight_map[service] = {
        weight_sum: weight_sum,
        server_list: server_list,
      };
      return server_list[Math.floor(Math.random() * weight_sum)];
    }
  },
  return_options_format: (service_url) => {
    let service_str_ary = service_url.split(":");
    return { hostname: service_str_ary[0], port: service_str_ary[1] };
  },
};
