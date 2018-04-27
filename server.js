var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	qs = require('querystring');

http.createServer(function(req, res) {

	console.log(req)

	if(req.method === "GET") {

		res.writeHead(200, {'Content-Type': 'text/html'});
		var fileStream = fs.createReadStream('form.html');
		fileStream.pipe(res);

	} else if(req.method === "POST") {

		var requestBody = '';
		req.on('data', function(data) {
			requestBody += data;
		});
		req.on('end', function() {
			var formData = qs.parse(requestBody);
			console.log(formData.xml)
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(formData.xml);
		});
	}

}).listen(3000);