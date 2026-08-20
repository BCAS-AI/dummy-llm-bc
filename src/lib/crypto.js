const crypto = require('crypto');

function minifyJson(value) {
  if (value === undefined || value === null || value === '') return '';
  return JSON.stringify(value);
}

function sha256HexLower(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex').toLowerCase();
}

function hmacSha512Base64(secret, data) {
  return crypto.createHmac('sha512', secret).update(data, 'utf8').digest('base64');
}

function signRsaSha256(privateKeyPem, data) {
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(data, 'utf8');
  signer.end();
  return signer.sign(privateKeyPem, 'base64');
}

function verifyRsaSha256(publicKeyPem, data, signatureBase64) {
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(data, 'utf8');
  verifier.end();
  return verifier.verify(publicKeyPem, signatureBase64, 'base64');
}

function timingSafeEqualBase64(a, b) {
  try {
    const bufA = Buffer.from(a, 'base64');
    const bufB = Buffer.from(b, 'base64');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (err) {
    return false;
  }
}

module.exports = {
  minifyJson,
  sha256HexLower,
  hmacSha512Base64,
  signRsaSha256,
  verifyRsaSha256,
  timingSafeEqualBase64,
};
