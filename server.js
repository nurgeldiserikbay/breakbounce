const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const HOSTNAME = '192.168.12.128' || 'local-break-bounce';

const staticPath = path.join(__dirname, './');

app.use(express.static(staticPath));

const options = {
  key: fs.readFileSync('./keys/local-break-bounce-key.pem'),
  cert: fs.readFileSync('./keys/local-break-bounce.pem'),
};

https.createServer(options, app).listen({ host: HOSTNAME, port: port }, () => {
  console.log(`Server running on https://${HOSTNAME}:${port}`);
});
