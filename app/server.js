var express = require("express");
var bodyParser = require("body-parser");
var fetch = require("node-fetch");

var port = process.env.PORT;

var app = express();
app.use(bodyParser.json());

app.post("/", (req, res) =>
  Promise.resolve(req.body)
    .then((body) => body.url)
    .then(fetch(url))
    .then((resp) => resp.text())
    .then((text) => res.send(text))
    .catch((err) => res.status(500).send(err))
);

app.listen(port);
