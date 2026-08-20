// ISO-8601 yyyy-MM-ddTHH:mm:ssTZD as required by the ABC OAuth & Signature docs.
const ISO_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;

// How far from "now" a X-TIMESTAMP is still accepted. ABC's real gateway
// enforces something similar (docs: "time used is not relevant to the
// current time"); this simulator uses a generous 5 minute window.
const TOLERANCE_MS = 5 * 60 * 1000;

function isValidIsoTimestamp(value) {
  return (
    typeof value === "string" &&
    ISO_REGEX.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

function isTimestampFresh(value, toleranceMs = TOLERANCE_MS) {
  const parsed = Date.parse(value);
  return Math.abs(Date.now() - parsed) <= toleranceMs;
}

// Current time as ISO-8601 with a "Z" offset, matching ISO_REGEX. Shared by
// anything that needs to mint a fresh X-TIMESTAMP: the /dev/sign/oauth
// helper route, scripts/sign-request.js, and test/e2e.js.
function nowIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

module.exports = { isValidIsoTimestamp, isTimestampFresh, nowIso };
