// Vercel entry point (see vercel.json: builds[0].src = "server.js").
// Express apps are (req, res) => {...}-shaped, which @vercel/node accepts
// directly as a serverless function handler — no .listen() call here.
module.exports = require('./src/app');
