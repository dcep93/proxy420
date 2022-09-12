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
      res.status(500).send(JSON.stringify(err));
    })
);

app.get("/*", (req, res) =>
  Promise.resolve({
    path: req.params[0],
    query: Object.entries(req.query)
      .map(([k, v]) => [k, v].join("="))
      .join("&"),
  })
    .then(({ path, query }) => `${path}?${query}`)
    .then((url) => fetch(url))
    .then((resp) => resp.text())
    .then((text) => res.send(text))
    .catch((err) => {
      console.error(err);
      res.status(500).send(JSON.stringify(err));
    })
);

app.listen(port, () => console.log("listening", port));
