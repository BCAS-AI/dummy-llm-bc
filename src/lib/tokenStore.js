// Stateless, self-verifying access tokens.
//
// A plain in-memory Map (the original implementation) does not work once
// this runs as a Vercel serverless function: the request that issues a
// token and the later request that redeems it are not guaranteed to hit
// the same warm instance, so a Map-based lookup would randomly 401 with
// "Client id not recognized". Instead the token itself carries
// {clientId, exp}, HMAC-signed so it can't be forged or edited, and
// verification needs no shared state at all.
const crypto = require('crypto');

const TTL_SECONDS = 900;

// Set TOKEN_SECRET in the deployment environment for anything beyond local
// testing; this fallback only exists so the simulator works out of the box.
const SECRET = process.env.TOKEN_SECRET || 'dummy-bca-llm-insecure-dev-secret';

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function issue(clientId) {
  const exp = Date.now() + TTL_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ clientId, exp })).toString('base64url');
  const signature = sign(payload);
  return { accessToken: `${payload}.${signature}`, expiresIn: TTL_SECONDS };
}

function resolve(accessToken) {
  if (typeof accessToken !== 'string' || !accessToken.includes('.')) return null;

  const [payload, signature] = accessToken.split('.');
  const expectedSignature = sign(payload || '');

  const signatureBuffer = Buffer.from(signature || '', 'base64url');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64url');
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch (err) {
    return null;
  }

  if (!data || typeof data.clientId !== 'string' || typeof data.exp !== 'number') return null;
  if (Date.now() > data.exp) return null;

  return { clientId: data.clientId };
}

module.exports = { issue, resolve, TTL_SECONDS };
