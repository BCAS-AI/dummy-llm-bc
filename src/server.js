// Local dev entry point. On Vercel, the root-level server.js exports the
// same app (see src/app.js) without calling listen() — Vercel owns the
// listener there.
const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`dummy-abc-llm simulator listening on http://localhost:${PORT}`);
});
