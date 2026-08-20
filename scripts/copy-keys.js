// Populates dist/keys/ from keys/ so Vercel's `includeFiles: ["dist/**"]`
// (see vercel.json) force-bundles what the deployed function needs to read
// at runtime. Runs automatically via the "postinstall" npm script, both
// locally and during Vercel's install step (before the Node builder traces
// and packages server.js).
//
// Both keys are copied. The public key is used by the server to verify
// asymmetric signatures. The private key powers the GET /dev/sign/oauth
// helper route, which lets the bundled Postman collection auto-generate
// valid RSA signatures (Postman's sandbox has no RSA-signing primitive) —
// this is safe only because this keypair is the exact published sample from
// BCA's own OAuth & Signature documentation, not a real secret. Never apply
// this "sign server-side, expose over HTTP" pattern to a real private key.
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const destDir = path.join(projectRoot, 'dist', 'keys');
fs.mkdirSync(destDir, { recursive: true });

for (const fileName of ['test-client-public-key.pem', 'test-client-private-key.pem']) {
  const sourceFile = path.join(projectRoot, 'keys', fileName);
  const destFile = path.join(destDir, fileName);
  fs.copyFileSync(sourceFile, destFile);
  console.log(`copy-keys: ${path.relative(projectRoot, sourceFile)} -> ${path.relative(projectRoot, destFile)}`);
}
