var http = require("http");

var port = process.env.PORT;

http.createServer(function(req, res) {
	res.write("Hello World");
	res.end();
}).listen(port);

