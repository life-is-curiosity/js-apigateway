var env = process.env.NODE_ENV == undefined ? "local" : process.env.NODE_ENV;
var string = require("string");
const error_mapper = require("../enum/response_code");
const rules = require("../config/api-rules.json");
const regex_match = require("./regex_match");

function invalid(error) {
  return { code: error.id, message: error.message };
}

function valid(data) {
  let success = error_mapper.success;
  return { code: success.id, message: success.message, data: data };
}

function check_service(body) {
  return rules[body.service];
}

function check_event(service, body) {
  return service[body.event];
}

function check_params(data, parameter_rules) {
  if (
    parameter_rules === undefined ||
    Object.keys(parameter_rules).length === 0
  ) {
    return true;
  } else {
    if (data === undefined) {
      return false;
    } else {
      for (const [key, value] of Object.entries(data)) {
        let result = check_params_property(key, value, parameter_rules);
        if (!result) {
          return false;
        }
      }
    }
    return true;
  }
}

function check_params_property(key, value, parameter_rules) {
  let json = parameter_rules[key];
  if (json === undefined) {
    return false;
  } else {
    let is_mandatory = json.mandatory;
    if (is_mandatory === undefined || (is_mandatory && value === undefined)) {
      return false;
    }
    let can_empty = json.can_empty;
    if (can_empty === undefined || (!can_empty && string(value).isEmpty())) {
      return false;
    }
    let max_length = json.max_length;
    if (string(value).length > max_length) {
      return false;
    }
    let is_numeric = json.numeric;
    if (
      is_numeric === undefined ||
      (is_numeric && !string(value).isNumeric())
    ) {
      return false;
    }
    let regex = json.regex;
    if (regex === undefined) {
      return false;
    } else {
      return regex_match(regex).test(value);
    }
  }
}

function check(request) {
  let body = request.body;
  let service = check_service(body);
  if (service === undefined) {
    return invalid(error_mapper.request_invalid_service);
  }
  let event = check_event(service, body);
  if (event === undefined) {
    return invalid(error_mapper.request_invalid_event);
  }
  return check_params(body.body, event.parameters)
    ? valid(body)
    : invalid(error_mapper.request_invalid_data);
}

module.exports = (request) => {
  return check(request);
};
