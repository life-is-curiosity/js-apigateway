module.exports = {
  success: {
    id: 0,
    message: "success",
  },
  forbidden_to_other_methods: {
    id: 10001,
    message: "Forbidden to other http methods",
  },
  forbidden_to_the_service: {
    id: 99999,
    message: "Invalid credential for the service",
  },
  over_rate_limit: {
    id: 99998,
    message: "Over rate limit",
  },
  request_invalid_service: { id: 10002, message: "Invalid service endpoint" },
  request_invalid_request_id: { id: 10003, message: "Invalid request_id" },
  request_invalid_event: { id: 10004, message: "Invalid event" },
  request_invalid_version: { id: 10005, message: "Invalid version" },
  request_invalid_data: { id: 10006, message: "Invalid data" },
  network_error: { id: 10007, message: "Network error" },
};
