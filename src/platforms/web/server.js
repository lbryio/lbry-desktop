const { WEB_SERVER_PORT } = require('../../config');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(WEB_SERVER_PORT, () => console.log(`UI server listening at http://localhost:${WEB_SERVER_PORT}`)); // eslint-disable-line
