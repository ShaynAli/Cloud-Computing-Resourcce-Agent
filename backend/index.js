const http = require('http');
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Server works with express");
});

app.listen(port, () => console.log('Server listening on port ' + port))