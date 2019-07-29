const express = require('express');
const path = require('path');
const app = express();
const port = 1337;

app.use(express.static(__dirname));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => console.log(`UI server listening at http://localhost:${port}`));
