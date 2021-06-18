//  npm install express body-parser mongoose cookies-parser cookies-session argon2

const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// Setup express
const app = express();

// Set-up bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Connect DB
mongoose.connect('mongodb://localhost:27017/project', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Setup cookieParser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Setup cookieSession
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hrs * 60 mins * 60 sec * 1000 ms
  }
}));

// API paths
const ballots = require("./ballots.js");
app.use("/api/ballots", ballots.routes);

const candidates = require("./candidates.js");
app.use("/api/candidates", candidates.routes);

const measures = require("./measures.js");
app.use("/api/measures", measures.routes);

const builders = require("./builders.js");
app.use("/api/builders", builders.routes);

app.listen(3000, () => console.log('Server listening on port 3000!'));
