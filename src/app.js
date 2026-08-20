const express = require('express');
const oauthRouter = require('./routes/oauth');
const llmGatewayRouter = require('./routes/llmGateway');
const docsRouter = require('./routes/docs');
const devToolsRouter = require('./routes/devTools');

const app = express();

// Multimodal requests can carry base64 files; docs cap the request at 10MB.
// Note: on Vercel, the platform's own request body limit (~4.5MB) applies
// before this ever runs, so the full 10MB ceiling only holds locally.
app.use(express.json({ limit: '10mb' }));

// Malformed JSON body -> LLM Gateway's general error schema.
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ responseCode: '400LM00', responseMessage: 'Input is not accessible' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(400).json({ responseCode: '400LM00', responseMessage: 'Input is not accessible' });
  }
  return next(err);
});

app.use('/docs', docsRouter);
app.use('/dev', devToolsRouter);
app.use('/openapi/v1.0', oauthRouter);
app.use('/openapi/v1.0/llm-gateway', llmGatewayRouter);

app.use((req, res) => {
  res.status(404).json({ responseCode: '404', responseMessage: 'Not Found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ responseCode: '500LM00', responseMessage: 'Internal Server Error' });
});

module.exports = app;
