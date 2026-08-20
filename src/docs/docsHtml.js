// Read-only, Swagger/Postman-style reference for this simulator's two
// endpoints. Plain self-contained HTML (inline CSS/JS, no CDN, no build
// step) so GET /docs works identically locally and on Vercel with zero
// extra bundling concerns.
const DOCS_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>dummy-abc-llm &mdash; API Reference</title>
<style>
  :root {
    --bg: #ffffff;
    --bg-sidebar: #14161f;
    --bg-sidebar-hover: #1f2230;
    --bg-code: #0f1117;
    --bg-panel: #f7f8fa;
    --border: #e4e6eb;
    --text: #1c1e26;
    --text-dim: #6b7280;
    --text-sidebar: #c7cad1;
    --text-sidebar-dim: #7d8190;
    --accent: #5b5ff0;
    --accent-dim: #eef0fe;
    --get: #2f9e44;
    --post: #d97706;
    --danger: #e03131;
    --radius: 8px;
    --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
    --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: var(--sans);
    color: var(--text);
    background: var(--bg);
    display: flex;
    min-height: 100vh;
  }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }

  /* ---- Sidebar ---- */
  nav.sidebar {
    width: 272px;
    flex: 0 0 272px;
    background: var(--bg-sidebar);
    color: var(--text-sidebar);
    padding: 20px 0 40px;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
  .brand {
    padding: 0 20px 16px;
    border-bottom: 1px solid #262a3a;
    margin-bottom: 12px;
  }
  .brand-title {
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    letter-spacing: 0.2px;
  }
  .brand-sub {
    font-size: 12px;
    color: var(--text-sidebar-dim);
    margin-top: 4px;
  }
  .nav-group-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-sidebar-dim);
    padding: 16px 20px 6px;
  }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 20px;
    font-size: 13.5px;
    color: var(--text-sidebar);
    cursor: pointer;
    border-left: 2px solid transparent;
  }
  .nav-link:hover { background: var(--bg-sidebar-hover); text-decoration: none; }
  .nav-link.active {
    background: var(--bg-sidebar-hover);
    border-left-color: var(--accent);
    color: #fff;
  }
  .nav-method {
    font-size: 9.5px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 4px;
    letter-spacing: 0.03em;
    flex: 0 0 auto;
  }
  .nav-method.get { background: rgba(47,158,68,0.18); color: #6bd487; }
  .nav-method.post { background: rgba(217,119,6,0.2); color: #f0a94e; }

  /* ---- Content ---- */
  main {
    flex: 1 1 auto;
    max-width: 900px;
    padding: 40px 48px 120px;
  }
  .banner {
    background: #fff4e5;
    border: 1px solid #ffdca8;
    color: #7a4a00;
    border-radius: var(--radius);
    padding: 12px 16px;
    font-size: 13.5px;
    margin-bottom: 36px;
  }
  section { margin-bottom: 56px; scroll-margin-top: 24px; }
  section h1 { font-size: 26px; margin: 0 0 6px; }
  section h2 { font-size: 21px; margin: 0 0 4px; display: flex; align-items: center; gap: 10px; }
  section h3 { font-size: 15px; margin: 28px 0 10px; color: var(--text); }
  .endpoint-path {
    font-family: var(--mono);
    font-size: 14px;
    color: var(--text-dim);
    margin: 0 0 18px;
  }
  .lede { color: var(--text-dim); font-size: 14.5px; line-height: 1.6; max-width: 68ch; }
  .method-badge {
    font-family: var(--mono);
    font-size: 11.5px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 5px;
    color: #fff;
    letter-spacing: 0.03em;
  }
  .method-badge.get { background: var(--get); }
  .method-badge.post { background: var(--post); }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    margin: 10px 0 4px;
  }
  th, td {
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  th {
    color: var(--text-dim);
    font-weight: 600;
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  td code, th code { font-family: var(--mono); font-size: 12.5px; }
  .req-y { color: var(--get); font-weight: 700; }
  .req-n { color: var(--text-dim); }

  pre {
    background: var(--bg-code);
    color: #d7dae0;
    border-radius: var(--radius);
    padding: 14px 16px;
    overflow-x: auto;
    font-family: var(--mono);
    font-size: 12.5px;
    line-height: 1.55;
    position: relative;
  }
  pre code { font-family: var(--mono); }
  .code-block { position: relative; margin: 10px 0 4px; }
  .copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    font-family: var(--sans);
    font-size: 11px;
    color: #c7cad1;
    background: #23273a;
    border: 1px solid #333850;
    border-radius: 5px;
    padding: 3px 8px;
    cursor: pointer;
  }
  .copy-btn:hover { background: #2c3149; }
  .copy-btn.copied { color: #6bd487; border-color: #2f9e44; }

  .tag-row { margin: 6px 0 18px; }
  .tag {
    display: inline-block;
    font-family: var(--mono);
    font-size: 11.5px;
    background: var(--accent-dim);
    color: var(--accent);
    padding: 2px 8px;
    border-radius: 5px;
    margin: 2px 6px 2px 0;
  }
  .note {
    font-size: 12.5px;
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 14px;
    color: var(--text-dim);
    margin: 12px 0;
  }
  .note strong { color: var(--text); }
  code.inline {
    font-family: var(--mono);
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 12.5px;
  }
  hr.sep { border: none; border-top: 1px solid var(--border); margin: 40px 0; }

  @media (max-width: 860px) {
    nav.sidebar { display: none; }
    main { padding: 24px; }
  }
</style>
</head>
<body>

<nav class="sidebar" id="sidebar">
  <div class="brand">
    <div class="brand-title">dummy-abc-llm</div>
    <div class="brand-sub">API Reference &middot; read-only</div>
  </div>

  <div class="nav-group-label">Introduction</div>
  <a class="nav-link" data-target="overview" href="#overview">Overview</a>

  <div class="nav-group-label">Authorization</div>
  <a class="nav-link" data-target="access-token" href="#access-token"><span class="nav-method post">POST</span> Get Access Token</a>
  <a class="nav-link" data-target="signature" href="#signature">Signature formulas</a>

  <div class="nav-group-label">Core Resources</div>
  <a class="nav-link" data-target="multimodal" href="#multimodal"><span class="nav-method post">POST</span> LLM Gateway Multimodal</a>
  <a class="nav-link" data-target="task-types" href="#task-types">Task types</a>
  <a class="nav-link" data-target="file-formats" href="#file-formats">File formats</a>

  <div class="nav-group-label">Reference</div>
  <a class="nav-link" data-target="docs-meta" href="#docs-meta"><span class="nav-method get">GET</span> This page</a>
  <a class="nav-link" data-target="oauth-errors" href="#oauth-errors">OAuth &amp; signature errors</a>
  <a class="nav-link" data-target="llm-errors" href="#llm-errors">LLM Gateway errors</a>
  <a class="nav-link" data-target="testing-helpers" href="#testing-helpers">Testing helpers</a>
</nav>

<main>

  <div class="banner">
    &#9888;&#65039; This is a local <strong>simulator</strong>, not ABC's official API. Every successful
    response below is picked from a small pool of static/randomized canned answers &mdash; no real
    LLM or bank system is ever called. Structure, headers, and signature rules mirror the source
    documentation 1:1 so client integrations can be built and tested against it.
  </div>

  <section id="overview">
    <h1>Overview</h1>
    <p class="lede">
      Two endpoints are implemented, mirroring <em>ABC API &ndash; OAuth &amp; Signature OpenAPI v1.1</em>
      and <em>OpenAPI-LLM-Gateway-Multimodal API v1.2</em>.
    </p>
    <table>
      <thead><tr><th>Method</th><th>Path</th><th>Usage</th></tr></thead>
      <tbody>
        <tr><td><span class="method-badge post">POST</span></td><td><code class="inline">/openapi/v1.0/access-token/b2b</code></td><td>Get access token</td></tr>
        <tr><td><span class="method-badge post">POST</span></td><td><code class="inline">/openapi/v1.0/llm-gateway/multimodal</code></td><td>LLM Gateway Multimodal</td></tr>
      </tbody>
    </table>
    <div class="note">
      Base URL: <code class="inline">https://dummy-llm-bc.vercel.app</code>
    </div>
  </section>

  <section id="access-token">
    <h2><span class="method-badge post">POST</span> Get Access Token</h2>
    <p class="endpoint-path">/openapi/v1.0/access-token/b2b</p>
    <p class="lede">
      OAuth2 <code class="inline">client_credentials</code> grant. The access token returned here is
      required as the <code class="inline">Authorization: Bearer</code> header on the Multimodal
      endpoint, and expires in 900 seconds.
    </p>

    <h3>Headers</h3>
    <table>
      <thead><tr><th>Name</th><th>Required</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code class="inline">X-TIMESTAMP</code></td><td class="req-y">Y</td><td>ISO-8601 datetime with timezone, e.g. <code class="inline">2024-03-19T11:46:16+07:00</code></td></tr>
        <tr><td><code class="inline">X-CLIENT-KEY</code></td><td class="req-y">Y</td><td>Registered <code class="inline">clientId</code></td></tr>
        <tr><td><code class="inline">X-SIGNATURE</code></td><td class="req-y">Y</td><td>Signature Asymmetric &mdash; see below</td></tr>
        <tr><td><code class="inline">Content-Type</code></td><td class="req-y">Y</td><td><code class="inline">application/json</code></td></tr>
      </tbody>
    </table>

    <h3>Request body</h3>
    <div class="code-block">
      <pre><code>{
  "grantType": "client_credentials"
}</code></pre>
    </div>

    <h3>Sample request</h3>
    <div class="code-block">
      <pre id="oauth-req-sample"><code>curl -X POST https://dummy-llm-bc.vercel.app/openapi/v1.0/access-token/b2b \\
  -H "X-TIMESTAMP: 2024-03-19T11:46:16+07:00" \\
  -H "X-CLIENT-KEY: b66925de-d8ec-476e-a170-6cf06c863b78" \\
  -H "X-SIGNATURE: &lt;base64 RSA signature&gt;" \\
  -H "Content-Type: application/json" \\
  -d '{"grantType":"client_credentials"}'</code></pre>
      <button class="copy-btn" data-copy-target="oauth-req-sample">Copy</button>
    </div>

    <h3>Success response &mdash; 200</h3>
    <div class="code-block">
      <pre><code>{
  "responseCode": "2007300",
  "responseMessage": "Successful",
  "accessToken": "&lt;opaque token&gt;",
  "tokenType": "bearer",
  "expiresIn": "900"
}</code></pre>
    </div>
  </section>

  <section id="signature">
    <h2>Signature formulas</h2>
    <p class="lede">Implemented exactly as specified in the OAuth &amp; Signature documentation.</p>

    <h3>Asymmetric &mdash; used on <code class="inline">/access-token/b2b</code></h3>
    <div class="code-block">
      <pre><code>StringToSign = clientId + "|" + X-TIMESTAMP
X-SIGNATURE  = Base64( SHA256withRSA(PrivateKey, StringToSign) )</code></pre>
    </div>
    <p class="lede">Verified server-side against the client's registered RSA public key.</p>

    <h3>Symmetric &mdash; used on <code class="inline">/llm-gateway/multimodal</code></h3>
    <div class="code-block">
      <pre><code>StringToSign = "POST" + ":" + RelativeUrl + ":" + AccessToken + ":" +
               lowercase(hex(SHA-256(MinifyJson(RequestBody)))) + ":" + X-TIMESTAMP
X-SIGNATURE  = Base64( HMAC-SHA512(ClientSecret, StringToSign) )</code></pre>
    </div>
    <div class="note">
      <strong>MinifyJson</strong> means the parsed request body re-serialized with no extra
      whitespace. An empty body is treated as an empty string, not <code class="inline">"{}"</code>.
    </div>
  </section>

  <section id="multimodal">
    <h2><span class="method-badge post">POST</span> LLM Gateway Multimodal</h2>
    <p class="endpoint-path">/openapi/v1.0/llm-gateway/multimodal</p>
    <p class="lede">
      Provides multimodal LLM capabilities. In this simulator, <code class="inline">answer</code> is
      always chosen from a static pool &mdash; no prompt content is actually processed by a model.
    </p>

    <h3>Headers</h3>
    <table>
      <thead><tr><th>Name</th><th>Required</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code class="inline">Authorization</code></td><td class="req-y">Y</td><td><code class="inline">Bearer &lt;accessToken&gt;</code> from the token endpoint</td></tr>
        <tr><td><code class="inline">X-TIMESTAMP</code></td><td class="req-y">Y</td><td>ISO-8601 datetime with timezone</td></tr>
        <tr><td><code class="inline">X-SIGNATURE</code></td><td class="req-y">Y</td><td>Signature Symmetric &mdash; see above</td></tr>
        <tr><td><code class="inline">CHANNEL-ID</code></td><td class="req-y">Y</td><td>Numeric channel identifier</td></tr>
        <tr><td><code class="inline">X-PARTNER-ID</code></td><td class="req-y">Y</td><td>Partner identifier (company code)</td></tr>
        <tr><td><code class="inline">X-EXTERNAL-ID</code></td><td class="req-y">Y</td><td>Numeric string, unique per day and per request (max 32 chars)</td></tr>
      </tbody>
    </table>

    <h3>Request body</h3>
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code class="inline">clientId</code></td><td>string</td><td class="req-y">Y</td><td>Unique ID for client/channel</td></tr>
        <tr><td><code class="inline">sessionId</code></td><td>string</td><td class="req-n">N</td><td>Alphanumeric, "-", "_", max 100 chars</td></tr>
        <tr><td><code class="inline">requestId</code></td><td>string</td><td class="req-n">N</td><td>Alphanumeric, "-", "_", max 100 chars</td></tr>
        <tr><td><code class="inline">domainId</code></td><td>string</td><td class="req-n">N</td><td>Alphanumeric, max 100 chars</td></tr>
        <tr><td><code class="inline">userName</code></td><td>string</td><td class="req-n">N</td><td>Alphanumeric, max 100 chars</td></tr>
        <tr><td><code class="inline">divisi</code></td><td>string</td><td class="req-n">N</td><td>Alphanumeric, max 100 chars</td></tr>
        <tr><td><code class="inline">configs.task</code></td><td>string</td><td class="req-n">N</td><td>See <a href="#task-types">Task types</a></td></tr>
        <tr><td><code class="inline">configs.modelName</code></td><td>string</td><td class="req-n">N</td><td>Model / engine name</td></tr>
        <tr><td><code class="inline">configs.persona</code></td><td>string</td><td class="req-n">N</td><td>Personality/character of the engine</td></tr>
        <tr><td><code class="inline">configs.temperature</code></td><td>integer</td><td class="req-n">N</td><td>0&ndash;1 recommended</td></tr>
        <tr><td><code class="inline">configs.maxToken</code></td><td>integer</td><td class="req-n">N</td><td>Maximum token output</td></tr>
        <tr><td><code class="inline">configs.recommendation</code></td><td>boolean</td><td class="req-n">N</td><td>Include next-prompt recommendations</td></tr>
        <tr><td><code class="inline">prompt</code></td><td>string / list</td><td class="req-y">Y</td><td>Question text, or OpenAI-style message list</td></tr>
        <tr><td><code class="inline">file</code></td><td>string / list</td><td class="req-n">N</td><td>Base64 data URI(s) &mdash; see <a href="#file-formats">File formats</a></td></tr>
      </tbody>
    </table>
    <div class="note">Max request size: <strong>10&nbsp;MB</strong>. Request timeout: <strong>30&nbsp;seconds</strong>.</div>

    <h3>Sample request</h3>
    <div class="code-block">
      <pre id="llm-req-sample"><code>curl -X POST https://dummy-llm-bc.vercel.app/openapi/v1.0/llm-gateway/multimodal \\
  -H "Authorization: Bearer &lt;accessToken&gt;" \\
  -H "X-TIMESTAMP: 2024-03-19T11:46:16+07:00" \\
  -H "X-SIGNATURE: &lt;base64 HMAC signature&gt;" \\
  -H "CHANNEL-ID: 95424" \\
  -H "X-PARTNER-ID: DIGITAL230844211" \\
  -H "X-EXTERNAL-ID: 80046" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientId": "b66925de-d8ec-476e-a170-6cf06c863b78",
    "sessionId": "session001",
    "requestId": "request001",
    "configs": { "task": "vllm-text-generation", "recommendation": true },
    "prompt": "buatkanlah cerita dongeng terbentuknya sebuah wilayah"
  }'</code></pre>
      <button class="copy-btn" data-copy-target="llm-req-sample">Copy</button>
    </div>

    <h3>Response fields</h3>
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code class="inline">responseCode</code></td><td>string</td><td>Error / success code</td></tr>
        <tr><td><code class="inline">responseMessage</code></td><td>string</td><td>Human-readable status</td></tr>
        <tr><td><code class="inline">requestId</code></td><td>string</td><td>Echoes the request's <code class="inline">requestId</code></td></tr>
        <tr><td><code class="inline">result.task</code></td><td>string</td><td>Completed task type</td></tr>
        <tr><td><code class="inline">result.answer</code></td><td>string</td><td>Static/randomized answer text</td></tr>
        <tr><td><code class="inline">result.tokenInput</code></td><td>integer</td><td>Estimated input tokens</td></tr>
        <tr><td><code class="inline">result.tokenOutput</code></td><td>integer</td><td>Estimated output tokens</td></tr>
        <tr><td><code class="inline">result.recommendation[].longPrompt</code></td><td>string</td><td>Long next-prompt suggestion</td></tr>
        <tr><td><code class="inline">result.recommendation[].shortPrompt</code></td><td>string</td><td>Short next-prompt suggestion</td></tr>
      </tbody>
    </table>

    <h3>Success response &mdash; 200</h3>
    <div class="code-block">
      <pre><code>{
  "responseCode": "200LM00",
  "responseMessage": "Transaction Successful",
  "requestId": "request001",
  "result": {
    "task": "vllm-text-generation",
    "answer": "&lt;static/randomized answer&gt;",
    "tokenInput": 24,
    "tokenOutput": 118,
    "recommendation": [
      { "longPrompt": "...", "shortPrompt": "..." },
      { "longPrompt": "...", "shortPrompt": "..." }
    ]
  }
}</code></pre>
    </div>
  </section>

  <section id="task-types">
    <h2>Task types</h2>
    <p class="lede">Passed as <code class="inline">configs.task</code>. Default when omitted: <code class="inline">vllm-text-generation</code>.</p>
    <table>
      <thead><tr><th>Task</th><th>Input</th><th>Output</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code class="inline">vllm-text-generation</code></td><td>text</td><td>text</td><td>Generates text from a prompt</td></tr>
        <tr><td><code class="inline">vllm-coder</code></td><td>text</td><td>text</td><td>Coding assistant</td></tr>
        <tr><td><code class="inline">vllm-vision</code></td><td>text, image</td><td>text</td><td>Processes multi-format input, generates text</td></tr>
        <tr><td><code class="inline">vllm-omni</code></td><td>text, image, audio</td><td>text</td><td>Speech-to-text and multimodal use cases</td></tr>
      </tbody>
    </table>
  </section>

  <section id="file-formats">
    <h2>File formats</h2>
    <p class="lede">
      <code class="inline">file</code> accepts a data URI (or list of them):
      <code class="inline">data:&lt;mimetype&gt;;base64,&lt;base64Value&gt;</code>
    </p>
    <table>
      <thead><tr><th>Type</th><th>Format</th><th>Mimetype</th></tr></thead>
      <tbody>
        <tr><td>file</td><td>pdf</td><td><code class="inline">application/pdf</code></td></tr>
        <tr><td>image</td><td>jpg / jpeg</td><td><code class="inline">image/jpeg</code></td></tr>
        <tr><td>image</td><td>png</td><td><code class="inline">image/png</code></td></tr>
        <tr><td>audio</td><td>wav</td><td><code class="inline">audio/wav</code></td></tr>
      </tbody>
    </table>
    <div class="note">Anything else returns <code class="inline">404LM01 File format not available</code>.</div>
  </section>

  <section id="docs-meta">
    <h2><span class="method-badge get">GET</span> This page</h2>
    <p class="endpoint-path">/docs</p>
    <p class="lede">Serves this reference page. Static HTML, no headers or authentication required, nothing to configure &mdash; works identically locally and on Vercel.</p>
  </section>

  <section id="oauth-errors">
    <h2>OAuth &amp; signature errors</h2>
    <table>
      <thead><tr><th>HTTP</th><th>Code</th><th>Message</th></tr></thead>
      <tbody>
        <tr><td>400</td><td><code class="inline">4007301</code></td><td>Invalid field format [X-TIMESTAMP]</td></tr>
        <tr><td>400</td><td><code class="inline">4007301</code></td><td>Invalid field format [clientId/clientSecret/grantType]</td></tr>
        <tr><td>400</td><td><code class="inline">4007302</code></td><td>Invalid mandatory field [X-CLIENT-KEY]</td></tr>
        <tr><td>401</td><td><code class="inline">4017300</code></td><td>Unauthorized. [Signature]</td></tr>
        <tr><td>401</td><td><code class="inline">4017300</code></td><td>Unauthorized. [Unknown client]</td></tr>
        <tr><td>401</td><td><code class="inline">4017300</code></td><td>Unauthorized. [Connection not allowed] <em>(defined, not enforced in this simulator)</em></td></tr>
        <tr><td>504</td><td><code class="inline">5047300</code></td><td>Timeout</td></tr>
      </tbody>
    </table>
  </section>

  <section id="llm-errors">
    <h2>LLM Gateway errors</h2>
    <table>
      <thead><tr><th>HTTP</th><th>Code</th><th>Message</th></tr></thead>
      <tbody>
        <tr><td>200</td><td><code class="inline">200LM00</code></td><td>Transaction Successful</td></tr>
        <tr><td>400</td><td><code class="inline">400LM00</code></td><td>Input is not accessible</td></tr>
        <tr><td>401</td><td><code class="inline">401LM00</code></td><td>Client id not recognized</td></tr>
        <tr><td>401</td><td><code class="inline">401LM01</code></td><td>Client ID is not authorized to access the service</td></tr>
        <tr><td>403</td><td><code class="inline">403LM00</code></td><td>Question has been detected to contain harmful, sexual, violent, self-harm, hate, or jailbreak risk content</td></tr>
        <tr><td>404</td><td><code class="inline">404LM00</code></td><td>Page not found</td></tr>
        <tr><td>404</td><td><code class="inline">404LM01</code></td><td>File format not available</td></tr>
        <tr><td>405</td><td><code class="inline">405LM00</code></td><td>Method not Allowed</td></tr>
        <tr><td>422</td><td><code class="inline">422LM00</code></td><td>Invalid Parameters</td></tr>
        <tr><td>422</td><td><code class="inline">422LM01</code></td><td>File content does not match the specified format or criteria</td></tr>
        <tr><td>429</td><td><code class="inline">429LM00</code></td><td>Input exceeds the allowed token limit</td></tr>
        <tr><td>500</td><td><code class="inline">500LM00</code></td><td>Internal Server Error</td></tr>
        <tr><td>502</td><td><code class="inline">502LM00</code></td><td>Failed to execute an operation on the gateway database</td></tr>
        <tr><td>502</td><td><code class="inline">502LM01</code></td><td>Failed to retrieve configuration or client access in the gateway database</td></tr>
        <tr><td>502</td><td><code class="inline">502LM02</code></td><td>An error occurred while the engine was processing the query</td></tr>
        <tr><td>502</td><td><code class="inline">502LM03</code></td><td>Recommendation prompt failed to generate</td></tr>
        <tr><td>504</td><td><code class="inline">504LM00</code></td><td>Connection timeout</td></tr>
      </tbody>
    </table>
  </section>

  <section id="testing-helpers">
    <h2>Testing helpers</h2>
    <p class="lede">Not part of the source documentation &mdash; simulator-only conveniences.</p>
    <h3>Force a specific error response</h3>
    <p class="lede">
      Every code in the table above can be forced on demand (still requires a valid signature/token)
      by embedding a marker in <code class="inline">prompt</code>:
    </p>
    <div class="code-block">
      <pre><code>{ "clientId": "...", "prompt": "SIMULATE_ERROR:429LM00" }</code></pre>
    </div>
    <div class="tag-row">
      <span class="tag">403LM00</span><span class="tag">422LM01</span><span class="tag">429LM00</span>
      <span class="tag">500LM00</span><span class="tag">502LM02</span><span class="tag">504LM00</span>
      <span class="tag">&hellip; any code from the table above</span>
    </div>
    <h3>Signing requests from the command line</h3>
    <p class="lede">
      See <code class="inline">scripts/sign-request.js</code> in the repo &mdash; generates a
      ready-to-run <code class="inline">curl</code> command using the seeded test client's keys.
    </p>
  </section>

</main>

<script>
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = links
    .map(function (link) { return document.getElementById(link.getAttribute('data-target')); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-target') === id);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-copy-target'));
      if (!target) return;
      var text = target.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied';
          btn.classList.add('copied');
          setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
        });
      }
    });
  });
})();
</script>

</body>
</html>
`;

module.exports = { DOCS_HTML };
