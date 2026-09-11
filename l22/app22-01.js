const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

const options = {
  key: fs.readFileSync('resource2.key'),
  cert: fs.readFileSync('resource2.crt'),
  ca: fs.readFileSync('ca2.crt')
};

app.get('/', (req, res) => {
  res.send('Привет! Сертификат работает.');
});

https.createServer(options, app).listen(3000, () => {
  console.log('Сервер запущен по HTTPS на порту 3000');
});
