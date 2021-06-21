const express = require('express');
const path = require('path');
const app = express();
app.use('/explorer', express.static(path.join(__dirname, '/build')));
app.get('/explorer', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/explorer/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/', function (req, res) {
  res.redirect("/explorer")
});
app.listen(8853);
