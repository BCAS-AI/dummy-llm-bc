// Minimal end-to-end smoke test: spins no server itself, expects
// `npm start` to already be running on PORT (default 3000). Exercises the
// full OAuth -> LLM Gateway flow using real signature generation, plus a
// couple of expected-error paths.
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { signRsaSha256, hmacSha512Base64, sha256HexLower, minifyJson } = require('../src/lib/crypto');
const { CLIENTS } = require('../src/config/clients');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const client = CLIENTS[0];
const privateKey = fs.readFileSync(path.join(__dirname, '..', 'keys', 'test-client-private-key.pem'), 'utf8');

function nowIso() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const tz = `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${tz}`;
}

async function getAccessToken() {
  const timestamp = nowIso();
  const stringToSign = `${client.clientId}|${timestamp}`;
  const signature = signRsaSha256(privateKey, stringToSign);

  const { data } = await axios.post(`${BASE_URL}/openapi/v1.0/access-token/b2b`, {
    grantType: 'client_credentials',
  }, {
    headers: {
      'X-TIMESTAMP': timestamp,
      'X-CLIENT-KEY': client.clientId,
      'X-SIGNATURE': signature,
      'Content-Type': 'application/json',
    },
  });

  console.log('[oauth] responseCode:', data.responseCode, '-', data.responseMessage);
  return data.accessToken;
}

async function callMultimodal(accessToken, body) {
  const timestamp = nowIso();
  const relativeUrl = '/openapi/v1.0/llm-gateway/multimodal';
  const bodyHash = sha256HexLower(minifyJson(body));
  const stringToSign = `POST:${relativeUrl}:${accessToken}:${bodyHash}:${timestamp}`;
  const signature = hmacSha512Base64(client.clientSecret, stringToSign);

  return axios.post(`${BASE_URL}${relativeUrl}`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-TIMESTAMP': timestamp,
      'X-SIGNATURE': signature,
      'CHANNEL-ID': client.channelId,
      'X-PARTNER-ID': client.partnerId,
      'X-EXTERNAL-ID': String(Date.now()),
      'Content-Type': 'application/json',
    },
    validateStatus: () => true,
  });
}

async function main() {
  const accessToken = await getAccessToken();

  const okResponse = await callMultimodal(accessToken, {
    clientId: client.clientId,
    sessionId: 'session001',
    requestId: 'request001',
    configs: { task: 'vllm-text-generation', recommendation: true },
    prompt: 'buatkanlah cerita dongeng terbentuknya sebuah wilayah',
  });
  console.log('[multimodal:success] status:', okResponse.status, 'responseCode:', okResponse.data.responseCode);
  console.log('  answer:', okResponse.data.result.answer.slice(0, 80) + '...');

  const badSignatureResponse = await axios.post(`${BASE_URL}/openapi/v1.0/llm-gateway/multimodal`, {
    clientId: client.clientId,
    prompt: 'test',
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-TIMESTAMP': nowIso(),
      'X-SIGNATURE': 'invalid-signature==',
      'CHANNEL-ID': client.channelId,
      'X-PARTNER-ID': client.partnerId,
      'X-EXTERNAL-ID': String(Date.now()),
      'Content-Type': 'application/json',
    },
    validateStatus: () => true,
  });
  console.log('[multimodal:bad-signature] status:', badSignatureResponse.status, 'responseCode:', badSignatureResponse.data.responseCode);

  const simulated = await callMultimodal(accessToken, {
    clientId: client.clientId,
    prompt: 'SIMULATE_ERROR:403LM00',
  });
  console.log('[multimodal:simulated-403] status:', simulated.status, 'responseCode:', simulated.data.responseCode);
}

main().catch((err) => {
  console.error('Demo failed:', err.response ? err.response.data : err.message);
  process.exit(1);
});
