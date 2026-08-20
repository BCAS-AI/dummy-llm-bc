const express = require('express');
const { DOCS_HTML } = require('../docs/docsHtml');

const router = express.Router();

// GET /docs — static, read-only API reference. No auth, no headers, no state.
router.get('/', (req, res) => {
  res.status(200).type('html').send(DOCS_HTML);
});

module.exports = router;
