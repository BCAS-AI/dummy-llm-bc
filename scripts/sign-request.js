#!/usr/bin/env node
// CLI helper to generate valid signed headers for the two endpoints exposed
// by this simulator, using the seeded test client's keys. Mirrors the exact
// formulas from the ABC OAuth & Signature documentation.
//
// Usage:
//   node scripts/sign-request.js oauth
//   node scripts/sign-request.js llm '<accessToken>' '<jsonBody>'

const fs = require("fs");
const path = require("path");
const {
  signRsaSha256,
  hmacSha512Base64,
  sha256HexLower,
  minifyJson,
} = require("../src/lib/crypto");
const { CLIENTS } = require("../src/config/clients");

const client = CLIENTS[0];
const privateKey = fs.readFileSync(
  path.join(__dirname, "..", "keys", "test-client-private-key.pem"),
  "utf8",
);

function nowIso() {
  const d = new Date();
  const pad = (n, len = 2) => String(n).padStart(len, "0");
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const tz = `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${tz}`
  );
}

function printOauth() {
  const timestamp = nowIso();
  const stringToSign = `${client.clientId}|${timestamp}`;
  const signature = signRsaSha256(privateKey, stringToSign);

  console.log("# POST /openapi/v1.0/access-token/b2b");
  console.log(`curl -X POST http://localhost:3000/openapi/v1.0/access-token/b2b \\
  -H "X-TIMESTAMP: ${timestamp}" \\
  -H "X-CLIENT-KEY: ${client.clientId}" \\
  -H "X-SIGNATURE: ${signature}" \\
  -H "Content-Type: application/json" \\
  -d '{"grantType":"client_credentials"}'`);
}

function printLlm(accessToken, bodyJson) {
  if (!accessToken) {
    console.error(
      "Missing <accessToken>. Run `node scripts/sign-request.js oauth` first and call the endpoint to obtain one.",
    );
    process.exit(1);
  }
  const body = bodyJson
    ? JSON.parse(bodyJson)
    : {
        clientId: client.clientId,
        prompt: "Halo, ini adalah contoh permintaan dari sign-request.js",
      };
  const timestamp = nowIso();
  const relativeUrl = "/openapi/v1.0/llm-gateway/multimodal";
  const bodyHash = sha256HexLower(minifyJson(body));
  const stringToSign = `POST:${relativeUrl}:${accessToken}:${bodyHash}:${timestamp}`;
  const signature = hmacSha512Base64(client.clientSecret, stringToSign);

  console.log("# POST /openapi/v1.0/llm-gateway/multimodal");
  console.log(`curl -X POST http://localhost:3000${relativeUrl} \\
  -H "Authorization: Bearer ${accessToken}" \\
  -H "X-TIMESTAMP: ${timestamp}" \\
  -H "X-SIGNATURE: ${signature}" \\
  -H "CHANNEL-ID: ${client.channelId}" \\
  -H "X-PARTNER-ID: ${client.partnerId}" \\
  -H "X-EXTERNAL-ID: ${Date.now()}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(body)}'`);
}

const [, , mode, ...rest] = process.argv;

if (mode === "oauth") {
  printOauth();
} else if (mode === "llm") {
  printLlm(rest[0], rest[1]);
} else {
  console.log(
    "Usage:\n  node scripts/sign-request.js oauth\n  node scripts/sign-request.js llm <accessToken> [jsonBody]",
  );
  process.exit(1);
}
