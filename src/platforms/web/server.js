const express = require('express');
const path = require('path');
const app = express();
const port = 1337;

app.use(express.static(__dirname));

app.listen(port, () => console.log(`UI server listening at localhost://${port}`));
