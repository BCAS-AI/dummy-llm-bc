const express = require('express');
const { findClientById } = require('../config/clients');
const { verifyRsaSha256 } = require('../lib/crypto');
const { isValidIsoTimestamp, isTimestampFresh } = require('../lib/timestamp');
const tokenStore = require('../lib/tokenStore');
const { OAUTH_ERRORS } = require('../lib/errorCodes');

const router = express.Router();

function respondError(res, entry) {
  return res.status(entry.status).json({
    responseCode: entry.code,
    responseMessage: entry.message,
  });
}

// POST /openapi/v1.0/access-token/b2b
router.post('/access-token/b2b', (req, res) => {
  const timestamp = req.header('X-TIMESTAMP');
  const clientKey = req.header('X-CLIENT-KEY');
  const signature = req.header('X-SIGNATURE');

  if (!clientKey) {
    return respondError(res, OAUTH_ERRORS['4007302']);
  }

  if (!timestamp || !isValidIsoTimestamp(timestamp) || !isTimestampFresh(timestamp)) {
    return respondError(res, OAUTH_ERRORS['4007301_TIMESTAMP']);
  }

  if (!req.body || req.body.grantType !== 'client_credentials') {
    return respondError(res, OAUTH_ERRORS['4007301_BODY']);
  }

  if (!signature) {
    return respondError(res, OAUTH_ERRORS.SIGNATURE);
  }

  const client = findClientById(clientKey);
  if (!client) {
    return respondError(res, OAUTH_ERRORS.UNKNOWN_CLIENT);
  }

  const stringToSign = `${clientKey}|${timestamp}`;
  let signatureValid = false;
  try {
    signatureValid = verifyRsaSha256(client.publicKey, stringToSign, signature);
  } catch (err) {
    signatureValid = false;
  }

  if (!signatureValid) {
    return respondError(res, OAUTH_ERRORS.SIGNATURE);
  }

  const { accessToken, expiresIn } = tokenStore.issue(client.clientId);

  return res.status(200).json({
    responseCode: '2007300',
    responseMessage: 'Successful',
    accessToken,
    tokenType: 'bearer',
    expiresIn: String(expiresIn),
  });
});

module.exports = router;
