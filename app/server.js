var http = require("http");
var url = require("url");
var fetch = require("fetch");

var port = process.env.PORT;

http
  .createServer(function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    fetch(queryObject.url)
      .then((resp) => resp.text())
      .then((text) => {
        res.write(text);
        res.end();
      });
  })
  .listen(port);
