var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fetch = require("node-fetch");
var fs = require("fs");

require.extensions[".txt"] = function (module, filename) {
  module.exports = fs.readFileSync(filename, "utf8");
};

var recorded_sha = require("./recorded_sha.txt");

var port = process.env.PORT;

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(recorded_sha);
});

app.post("/", (req, res) =>
  Promise.resolve(req.body)
    .then(({ url, options }) => fetch(url, options))
    .then((resp) => resp.text())
    .then((text) => res.send(text))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    })
);

app.get("/test", (req, res) => res.send(req.query.url));

app.get("/get", (req, res) =>
  Promise.resolve(req.query.url)
    .then((url) => `https://tinyurl.is/${url}`)
    .then((url) => fetch(url))
    .then((resp) => resp.text())
    .then((text) => res.send(text))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    })
);

app.listen(port);
