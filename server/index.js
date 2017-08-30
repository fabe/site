require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const compression = require('compression');
const { parse } = require('url');
const next = require('next');

// Set up some globals.
const dev = process.env.NODE_ENV !== 'production';
const port = dev ? 1337 : PORT || 8080;

// Set up next.js.
const app = next({ dev });
const handle = app.getRequestHandler();

// Some security middlewares,
const security = [
  hpp(),
  helmet.xssFilter(),
  helmet.frameguard('deny'),
  helmet.ieNoOpen(),
  helmet.noSniff(),
];

app.prepare().then(() => {
  const server = express();

  // Body parser.
  server.use(bodyParser.json());

  // Use CORS.
  server.use(cors());

  // Use HPP & helmet for security.
  server.use(...security);

  // Use compression.
  server.use(compression());

  // For all other routes, use next.js.
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`${'\u2705'}  Ready on http://localhost:${port}`);
  });
});
