const http = require('http');
const express = require('express');
const serveIndex = require('serve-index');
var path = require('path');

const app = express();
const port = 3000;
  
// viewed at http://localhost:3000
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../frontend/login.html'));
});

app.listen(port, () => console.log('Server listening on port ' + port));

