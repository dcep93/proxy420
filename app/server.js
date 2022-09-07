var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fetch = require("node-fetch");

var port = process.env.PORT;

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/", (req, res) =>
  Promise.resolve(req.body)
    .then((body) => body.url)
    .then((url) => fetch(url))
    .then((resp) => resp.text())
    .then((text) => res.send(text))
    .catch((err) => {
      console.error(error);
      res.status(500).send(err);
    })
);

app.listen(port);
