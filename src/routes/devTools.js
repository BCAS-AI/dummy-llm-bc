// Dev/testing-only helper. Postman's script sandbox has no RSA-signing
// primitive (CryptoJS covers HMAC/SHA fine, but not SHA256withRSA), so the
// bundled Postman collection's "Get Access Token" request calls this route
// from its pre-request script (via pm.sendRequest) to obtain a freshly
// signed X-TIMESTAMP/X-SIGNATURE pair instead. Not part of the mirrored ABC
// API surface.
const express = require("express");
const fs = require("fs");
const path = require("path");
const { CLIENTS } = require("../config/clients");
const { signRsaSha256 } = require("../lib/crypto");
const { nowIso } = require("../lib/timestamp");

const router = express.Router();

const PRIVATE_KEY_PATH = path.join(
  __dirname,
  "..",
  "..",
  "dist",
  "keys",
  "test-client-private-key.pem",
);

router.get("/sign/oauth", (req, res) => {
  let privateKey;
  try {
    privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
  } catch (err) {
    return res.status(500).json({
      error:
        "Test private key not found. Run `npm install` (the postinstall step copies keys/ into dist/keys/).",
    });
  }

  const client = CLIENTS[0];
  const timestamp = nowIso();
  const stringToSign = `${client.clientId}|${timestamp}`;
  const signature = signRsaSha256(privateKey, stringToSign);

  return res
    .status(200)
    .json({ clientId: client.clientId, timestamp, signature });
});

module.exports = router;
