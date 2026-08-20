// Error tables taken verbatim from:
//  - "ABC API - OAuth & Signature OpenAPI v1.1" (OAUTH_ERRORS)
//  - "Technical Documentation OpenAPI-LLM-Gateway-Multimodal API v1.2" (LLM_ERRORS)

const OAUTH_ERRORS = {
  "4007301_TIMESTAMP": {
    status: 400,
    code: "4007301",
    message: "Invalid field format [X-TIMESTAMP]",
  },
  "4007301_BODY": {
    status: 400,
    code: "4007301",
    message: "Invalid field format [clientId/clientSecret/grantType]",
  },
  4007302: {
    status: 400,
    code: "4007302",
    message: "Invalid mandatory field [X-CLIENT-KEY]",
  },
  SIGNATURE: {
    status: 401,
    code: "4017300",
    message: "Unauthorized. [Signature]",
  },
  UNKNOWN_CLIENT: {
    status: 401,
    code: "4017300",
    message: "Unauthorized. [Unknown client]",
  },
  CONNECTION_NOT_ALLOWED: {
    status: 401,
    code: "4017300",
    message: "Unauthorized. [Connection not allowed]",
  },
  TIMEOUT: { status: 504, code: "5047300", message: "Timeout" },
};

// Keyed by responseCode so the /multimodal route can look codes up both for
// normal validation failures and for the SIMULATE_ERROR:<code> test trigger
// documented in the README.
const LLM_ERRORS = {
  "400LM00": {
    status: 400,
    code: "400LM00",
    message: "Input is not accessible",
  },
  "401LM00": {
    status: 401,
    code: "401LM00",
    message: "Client id not recognized",
  },
  "401LM01": {
    status: 401,
    code: "401LM01",
    message: "Client ID is not authorized to access the service",
  },
  "403LM00": {
    status: 403,
    code: "403LM00",
    message:
      "Question has been detected to contain harmful, sexual, violent, self-harm, hate, or jailbreak risk content",
  },
  "404LM00": { status: 404, code: "404LM00", message: "Page not found" },
  "404LM01": {
    status: 404,
    code: "404LM01",
    message: "File format not available",
  },
  "405LM00": { status: 405, code: "405LM00", message: "Method not Allowed" },
  "422LM00": { status: 422, code: "422LM00", message: "Invalid Parameters" },
  "422LM01": {
    status: 422,
    code: "422LM01",
    message: "File content does not match the specified format or criteria",
  },
  "429LM00": {
    status: 429,
    code: "429LM00",
    message: "Input exceeds the allowed token limit",
  },
  "500LM00": { status: 500, code: "500LM00", message: "Internal Server Error" },
  "502LM00": {
    status: 502,
    code: "502LM00",
    message: "Failed to execute an operation on the gateway database",
  },
  "502LM01": {
    status: 502,
    code: "502LM01",
    message:
      "Failed to retrieve configuration or client access in the gateway database",
  },
  "502LM02": {
    status: 502,
    code: "502LM02",
    message: "An error occurred while the engine was processing the query",
  },
  "502LM03": {
    status: 502,
    code: "502LM03",
    message: "Recommendation prompt failed to generate",
  },
  "504LM00": { status: 504, code: "504LM00", message: "Connection timeout" },
};

module.exports = { OAUTH_ERRORS, LLM_ERRORS };
