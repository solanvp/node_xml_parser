var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	qs = require('querystring'),
	_ = require('lodash');

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
				var result = parseXML(formData.xml)

				res.writeHead(200, {'Content-Type': 'application/json'});

			} catch(e){
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(e);
			}
		

		});
	}

}).listen(3000);



function parseXML(xmlString){

	var xmlString2 = _.replace(formData.xml, /[\t\r\n]/g, '')
	console.log(xmlString2)
	var xmlString3 = _.escape(xmlString2)
	console.log(xmlString3)


	var tokens = _.split(xmlString3, "&lt;");

	// Defining own parent
	tokens[0] = "json"
	tokens.push("/json")
	console.log(tokens)


	var result = processParent(tokens, 1, "json")
	console.log(result.childs)

	return result.childs
}



function processParent(tokens, i, parent){

	var childs = {}

	var prevTag = null
	var openFlag = true

	var parentCloseFound = false

	while(!parentCloseFound &&  i < tokens.length){

		var values = _.split(tokens[i].trim(), "&gt;")
		console.log(values)

		if(values.length > 2){
			throw "Error in xml format, tag opening and closing mismatch, ref: " +values[0]
		}

		if(!_.startsWith(values[0], '/')){  // Start of tag

			if(!openFlag){
				throw  "Error in xml format, new open tag withoug closing previous, ref: "+values[0]
			}

			// No value => parent tag
			if("" === values[1] ){  
				var subParent = processParent(tokens, ++i, values[0])
				i = subParent.i - 1
				childs[values[0]] = subParent.childs
				console.log(subParent.childs)
				openFlag = true
			} else {
				childs[values[0]] =  values[1]
				prevTag = values[0]
				openFlag = false
			}

		} else { 							// End of tag

			if(openFlag){
				if(parent === values[0].substring(1)){
					parentCloseFound = true

				} else {
					throw  "Error in xml format, closing tag with no opening, ref:"+values[0]
				}
			}
			if(prevTag && prevTag !== values[0].substring(1)) {
				throw  "Error in xml format, tag not closed, tag: "+prevTag
			}

			prevTag = null
			openFlag = true
		}

		i++;
	}

	if(!parentCloseFound){
		throw  "Error in xml format, parent tag not closed, tag: "+parent
	}

	return {i, childs}
}