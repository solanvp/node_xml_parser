var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	qs = require('querystring');

var parser = require('./parser')

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

			try{

				var result = parser.parseXML(formData.xml)

				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(result));

			} catch(e){
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(e);
			}
		

		});
	}

}).listen(3000);
