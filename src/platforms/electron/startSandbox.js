import express from 'express';
import unpackByOutpoint from './unpackByOutpoint';

// Polyfills and `lbry-redux`
global.fetch = require('node-fetch');
global.window = global;
if (typeof global.fetch === 'object') {
  global.fetch = global.fetch.default;
}

const { Lbry } = require('lbry-redux');

delete global.window;

export default async function startSandbox() {
  const sandbox = express();
  const port = 5278;

  sandbox.get('/set/:outpoint', async(req, res) => {
    const { outpoint } = req.params;

    const resolvedPath = await unpackByOutpoint(Lbry, outpoint);

    sandbox.use(`/sandbox/${outpoint}/`, express.static(resolvedPath));

    res.send(`/sandbox/${outpoint}/`);
  });

  sandbox.listen(port, 'localhost', () => console.log(`Sandbox listening on port ${port}.`));
}
