var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fetch = require("node-fetch");
var fs = require("fs");
var os = require("os");

require.extensions[".txt"] = function (module, filename) {
  module.exports = fs.readFileSync(filename, "utf8");
};

var recorded_sha = require("./recorded_sha.txt");
var hostname = os.hostname();

var port = process.env.PORT;

const VM_ADDR = "http://35.188.37.178";

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(recorded_sha);
});

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
      res.status(500).send(`${hostname}: ${err}`);
    })
);

const cache = {};
function trimCache() {
  const trimTime = new Date().getTime() - 24 * 60 * 60 * 1000;
  Array.from(Object.entries(cache))
    .map(([key, { timestamp }]) => ({
      key,
      timestamp,
    }))
    .filter(({ timestamp }) => timestamp < trimTime)
    .forEach(({ key }) => {
      delete cache[key];
    });
}
setInterval(trimCache, 4 * 60 * 60 * 1000);
app.post("/", (req, res) =>
  Promise.resolve(req.body)
    .then(({ maxAgeMs, url, options }) => {
      const cached = cache[url];
      const timestamp = new Date().getTime();
      if (cached && timestamp - cached.timestamp < maxAgeMs)
        return Promise.resolve(cached.data);
      return fetch(url, options)
        .then((resp) =>
          (options || {}).base64
            ? resp
                .arrayBuffer()
                .then((arrayBuffer) =>
                  btoa(
                    new Uint8Array(arrayBuffer).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  )
                )
            : resp.text()
        )
        .then((data) => {
          cache[url] = { timestamp, data };
          return data;
        });
    })
    .then((text) => res.send(text))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`${hostname}: ${err}`);
    })
);

app.post("/proxy", (req, res) =>
  Promise.resolve(req.body)
    .then((body) =>
      fetch(VM_ADDR, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })
    )
    .then((resp) => resp.text())
    .then((text) => res.send(text))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`${hostname}: ${err}`);
    })
);

app.listen(port, () => console.log("listening", port));
