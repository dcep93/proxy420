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

app.get("/test", (req, res) =>
  fetch(
    "https://tinyurl.is/cdn-cgi/challenge-platform/h/g/orchestrate/jsch/v1?ray=749349e39af86fe9",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((resp) => resp.text())
    .then((text) => res.send(text))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    })
);

app.get("/:url*", (req, res) =>
  Promise.resolve(req.params.url)
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
