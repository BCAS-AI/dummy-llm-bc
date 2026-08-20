# dummy-bca-llm

A local simulator that mirrors, 1:1, the request/response contract of two BCA
OpenAPI documents:

- `BCA API - OAuth & Signature OpenAPI v1.1` — access token issuance,
  asymmetric (RSA) and symmetric (HMAC) signature validation.
- `Technical Documentation OpenAPI-LLM-Gateway-Multimodal API v1.2` — the
  `/llm-gateway/multimodal` endpoint.

**No real LLM is called.** Every successful response is picked from a small
pool of static, pre-written answers (randomized per request), and every
header/signature/field validation rule from the docs is enforced for real, so
you can develop and test a client integration end-to-end without touching
BCA's actual sandbox.

## Endpoints

| Method | Path | Usage |
|---|---|---|
| POST | `/openapi/v1.0/access-token/b2b` | Get an access token (OAuth2 client_credentials) |
| POST | `/openapi/v1.0/llm-gateway/multimodal` | LLM Gateway Multimodal (static/randomized answer) |
| GET | `/docs` | Read-only, Swagger/Postman-style API reference (static HTML, no auth) |

## Run it

```bash
npm install
npm start
# -> dummy-bca-llm simulator listening on http://localhost:3000
```

## Seeded test client

A single client, matching the worked examples published in the BCA docs
("Signature Asymmetric How to" / "Signature Symmetric How to"), is seeded in
[`src/config/clients.js`](src/config/clients.js):

| Field | Value |
|---|---|
| `clientId` | `b66925de-d8ec-476e-a170-6cf06c863b78` |
| `clientSecret` | `efc71ced-b0e7-4b47-8270-3c24829764aa` |
| `CHANNEL-ID` | `95424` |
| `X-PARTNER-ID` | `DIGITAL230844211` |

Its RSA keypair lives in [`keys/`](keys) — `test-client-private-key.pem` is
what a *partner* would hold to sign access-token requests; the server only
ever reads the public key to verify. (This keypair was verified against the
doc's own worked signature example — see below.)

## Signing requests

Generating the `X-SIGNATURE` headers by hand is tedious, so a helper script
does it for you using the seeded client's keys:

```bash
# Print a ready-to-run curl for the access-token endpoint
node scripts/sign-request.js oauth

# Print a ready-to-run curl for the LLM Gateway (needs an access token)
node scripts/sign-request.js llm <accessToken> '{"clientId":"b66925de-d8ec-476e-a170-6cf06c863b78","prompt":"halo"}'
```

Or run the scripted end-to-end demo (server must already be running):

```bash
npm run demo
```

## Postman collection

[`postman/dummy-bca-llm.postman_collection.json`](postman/dummy-bca-llm.postman_collection.json)
imports as a normal collection — no separate environment file needed, everything
(including the seeded client's credentials) is a collection variable. Import it,
run **Authorization → Get Access Token** once, then anything under **Core
Resources** just works:

- Symmetric (HMAC-SHA512) signatures are generated natively in the request's
  pre-request script via Postman's built-in `CryptoJS`.
- Asymmetric (RSA) signatures can't be — Postman's sandbox has no RSA-signing
  primitive — so that request's pre-request script instead calls this
  simulator's own `GET /dev/sign/oauth` helper route (via `pm.sendRequest`) to
  get a freshly signed header pair. That route only exists because the seeded
  keypair is the exact published sample from BCA's own docs, not a real
  secret; never expose a real private key over HTTP like this.

To point the collection at a deployed instance instead of localhost, edit the
`baseUrl` collection variable.

## Signature formulas implemented

**Asymmetric** (access-token endpoint):

```
StringToSign = clientId + "|" + X-TIMESTAMP
X-SIGNATURE  = Base64( SHA256withRSA(PrivateKey, StringToSign) )
```

**Symmetric** (multimodal endpoint):

```
StringToSign = "POST" + ":" + RelativeUrl + ":" + AccessToken + ":" +
               lowercase(hex(SHA-256(MinifyJson(RequestBody)))) + ":" + Timestamp
X-SIGNATURE  = Base64( HMAC-SHA512(ClientSecret, StringToSign) )
```

Both are implemented in [`src/lib/crypto.js`](src/lib/crypto.js) and match
the docs' worked examples exactly (`keys/` was validated by re-signing the
doc's sample `StringToSign` and confirming a byte-for-byte match against the
doc's published sample `X-SIGNATURE`).

## Required headers

**Access token** (`/access-token/b2b`): `X-TIMESTAMP`, `X-CLIENT-KEY`,
`X-SIGNATURE`, `Content-Type`.

**Multimodal** (`/llm-gateway/multimodal`): `Authorization: Bearer <token>`,
`X-TIMESTAMP`, `X-SIGNATURE`, `CHANNEL-ID`, `X-PARTNER-ID`, `X-EXTERNAL-ID`,
`Content-Type`.

Timestamps must be ISO-8601 (`yyyy-MM-ddTHH:mm:ssTZD`) and within 5 minutes
of server time, or you'll get the doc's `Invalid field format [X-TIMESTAMP]`
/ `400LM00` errors.

## Request body (multimodal)

Mirrors the doc's field table: `clientId` (required), `sessionId`,
`requestId`, `domainId`, `userName`, `divisi` (all optional, alphanumeric
`-`/`_`, max 100 chars), `configs.{task,modelName,persona,temperature,
maxToken,recommendation}`, `prompt` (required — string or OpenAI-style
message list), `file` (optional — base64 data URI, string or list).

Supported file mime types: `application/pdf`, `image/jpeg`, `image/png`,
`audio/wav`. Anything else returns `404LM01 File format not available`.

## Triggering specific error responses

Every error code from both docs is wired up. Most are triggered naturally
(missing header, bad signature, bad field, unsupported mime type). To force
any *other* documented error on demand — e.g. to test your client's handling
of a 500 or a 429 — put a marker in the `prompt` field:

```json
{ "clientId": "...", "prompt": "SIMULATE_ERROR:429LM00" }
```

Valid codes are anything listed in [`src/lib/errorCodes.js`](src/lib/errorCodes.js)
(`403LM00`, `422LM01`, `429LM00`, `500LM00`, `502LM00..03`, `504LM00`, etc).
This still requires a valid signature/token — it only substitutes the final
business-logic response.

## Deploying on Vercel

`vercel.json` (legacy `builds`/`routes` config) points at the root-level
`server.js`, which just exports the Express app from `src/app.js` — no
`.listen()` call, Vercel owns the request lifecycle. `src/server.js` (used by
`npm start`) is the separate local-dev entry that does call `.listen()`.

Two things worth knowing:

- Access tokens are **stateless** (`src/lib/tokenStore.js`): a Map-based
  store would silently break on Vercel since the request that issues a token
  and the one that redeems it aren't guaranteed to hit the same warm
  instance. Instead the token is `{clientId, exp}` HMAC-signed into itself —
  set a `TOKEN_SECRET` env var on the deployment; a dev-only default is used
  otherwise.
- `keys/*.pem` are copied into `dist/keys/` by `scripts/copy-keys.js`, wired
  up as the `postinstall` npm script, so Vercel's `includeFiles: ["dist/**"]`
  bundles them into the deployed function. `src/config/clients.js` and
  `src/routes/devTools.js` read from `dist/keys/`, not `keys/`.

## Notes / deliberate simplifications

- `IP whitelist` / `Unauthorized. [Connection not allowed]` is defined in the
  error table but not enforced (no real network boundary in a local sim).
- Symmetric-encryption (AES-256, used by some *other* BCA services like
  OneKlik) is out of scope — not used by this endpoint.
- The doc's 10MB request-size ceiling only holds locally; Vercel's own
  platform-level body limit (~4.5MB) applies first when deployed there.
