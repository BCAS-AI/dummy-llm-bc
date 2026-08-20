const express = require('express');
const { findClientById } = require('../config/clients');
const tokenStore = require('../lib/tokenStore');
const { minifyJson, sha256HexLower, hmacSha512Base64, timingSafeEqualBase64 } = require('../lib/crypto');
const { isValidIsoTimestamp, isTimestampFresh } = require('../lib/timestamp');
const { pickAnswer, pickRecommendations, estimateTokens } = require('../lib/responses');
const { LLM_ERRORS } = require('../lib/errorCodes');
const { canonicalizeRelativeUrl } = require('../lib/relativeUrl');

const router = express.Router();

// Per doc v1.1: alphanumeric, "-", "_", max length 100.
const ID_FIELD_REGEX = /^[A-Za-z0-9_-]{1,100}$/;
// domainId/userName/divisi: alphanumeric, max length 100 (no -/_ per the field table).
const NAME_FIELD_REGEX = /^[A-Za-z0-9]{1,100}$/;

const SUPPORTED_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'audio/wav']);

function respondError(res, entry, extra = {}) {
  return res.status(entry.status).json({
    responseCode: entry.code,
    responseMessage: entry.message,
    ...extra,
  });
}

function collectMimeTypes(body) {
  const mimeTypes = [];

  const fromDataUri = (value) => {
    if (typeof value !== 'string') return;
    const match = value.match(/^data:([^;]+);base64,/i);
    if (match) mimeTypes.push(match[1].toLowerCase());
  };

  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
    } else {
      fromDataUri(value);
    }
  };
  visit(body.file);

  if (Array.isArray(body.prompt)) {
    body.prompt.forEach((message) => {
      if (message && Array.isArray(message.content)) {
        message.content.forEach((part) => {
          if (part && part.type === 'file' && part.mime_type) {
            mimeTypes.push(String(part.mime_type).toLowerCase());
          }
        });
      }
    });
  }

  return mimeTypes;
}

// Lets callers deterministically exercise any documented error path by
// embedding SIMULATE_ERROR:<code> in the prompt text, e.g.
// "prompt": "SIMULATE_ERROR:403LM00" -> returns the harmful-content error.
function findSimulatedError(body) {
  const haystack = JSON.stringify(body.prompt || '');
  const match = haystack.match(/SIMULATE_ERROR:([0-9]{3}[A-Z0-9]{2,4})/);
  return match ? LLM_ERRORS[match[1]] || null : null;
}

router.post('/multimodal', (req, res) => {
  const channelId = req.header('CHANNEL-ID');
  const partnerId = req.header('X-PARTNER-ID');
  const externalId = req.header('X-EXTERNAL-ID');
  const authorization = req.header('Authorization');
  const timestamp = req.header('X-TIMESTAMP');
  const signature = req.header('X-SIGNATURE');

  if (!channelId || !partnerId || !externalId || !authorization || !timestamp || !signature) {
    return respondError(res, LLM_ERRORS['400LM00']);
  }

  if (!isValidIsoTimestamp(timestamp) || !isTimestampFresh(timestamp)) {
    return respondError(res, LLM_ERRORS['400LM00']);
  }

  const bearerMatch = authorization.match(/^Bearer\s+(.+)$/i);
  const accessToken = bearerMatch ? bearerMatch[1] : null;
  const session = accessToken ? tokenStore.resolve(accessToken) : null;
  if (!session) {
    return respondError(res, LLM_ERRORS['401LM00']);
  }

  const client = findClientById(session.clientId);
  if (!client || client.channelId !== channelId || client.partnerId !== partnerId) {
    return respondError(res, LLM_ERRORS['401LM01']);
  }

  const body = req.body && Object.keys(req.body).length > 0 ? req.body : '';
  const minified = minifyJson(body);
  const bodyHash = sha256HexLower(minified);
  const relativeUrl = canonicalizeRelativeUrl(req.originalUrl);
  const stringToSign = `POST:${relativeUrl}:${accessToken}:${bodyHash}:${timestamp}`;
  const expectedSignature = hmacSha512Base64(client.clientSecret, stringToSign);

  if (!timingSafeEqualBase64(signature, expectedSignature)) {
    return respondError(res, LLM_ERRORS['401LM00'], { responseMessage: 'Unauthorized. [Signature]' });
  }

  const payload = req.body || {};

  const simulated = findSimulatedError(payload);
  if (simulated) {
    return respondError(res, simulated);
  }

  if (!payload.clientId || !payload.prompt) {
    return respondError(res, LLM_ERRORS['422LM00']);
  }

  const fieldsToValidate = [
    ['sessionId', ID_FIELD_REGEX],
    ['requestId', ID_FIELD_REGEX],
    ['domainId', NAME_FIELD_REGEX],
    ['userName', NAME_FIELD_REGEX],
    ['divisi', NAME_FIELD_REGEX],
  ];
  for (const [field, regex] of fieldsToValidate) {
    if (payload[field] !== undefined && !regex.test(String(payload[field]))) {
      return respondError(res, LLM_ERRORS['422LM00']);
    }
  }

  const mimeTypes = collectMimeTypes(payload);
  const unsupported = mimeTypes.find((mime) => !SUPPORTED_MIME_TYPES.has(mime));
  if (unsupported) {
    return respondError(res, LLM_ERRORS['404LM01']);
  }

  const task = (payload.configs && payload.configs.task) || 'vllm-text-generation';
  const answer = pickAnswer(task);
  const wantsRecommendation = !payload.configs || payload.configs.recommendation !== false;

  return res.status(200).json({
    responseCode: '200LM00',
    responseMessage: 'Transaction Successful',
    requestId: payload.requestId || null,
    result: {
      task,
      answer,
      tokenInput: estimateTokens(JSON.stringify(payload.prompt)),
      tokenOutput: estimateTokens(answer),
      ...(wantsRecommendation ? { recommendation: pickRecommendations() } : {}),
    },
  });
});

// Any other method on /multimodal.
router.all('/multimodal', (req, res) => respondError(res, LLM_ERRORS['405LM00']));

// Any other subpath under /openapi/v1.0/llm-gateway.
router.all('*', (req, res) => respondError(res, LLM_ERRORS['404LM00']));

module.exports = router;
