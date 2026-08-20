// Seeded test client, using the exact clientId/clientSecret/RSA keypair
// published as the worked example in "Signature Asymmetric How to" /
// "Signature Symmetric How to" sections of the ABC OAuth & Signature docs.
// CHANNEL-ID / X-PARTNER-ID reuse the sample values from the LLM Gateway doc.
const fs = require("fs");
const path = require("path");

// Read from dist/keys, not keys/: dist/ is what vercel.json's
// `includeFiles: ["dist/**"]` force-bundles into the deployed function, and
// scripts/copy-keys.js (run via the "postinstall" npm script) populates it
// from keys/ on every install, local or on Vercel.
const publicKey = fs.readFileSync(
  path.join(
    __dirname,
    "..",
    "..",
    "dist",
    "keys",
    "test-client-public-key.pem",
  ),
  "utf8",
);

const CLIENTS = [
  {
    clientId: "b66925de-d8ec-476e-a170-6cf06c863b78",
    clientSecret: "efc71ced-b0e7-4b47-8270-3c24829764aa",
    publicKey,
    channelId: "95424",
    partnerId: "DIGITAL230844211",
  },
];

function findClientById(clientId) {
  return CLIENTS.find((client) => client.clientId === clientId) || null;
}

module.exports = { CLIENTS, findClientById };
