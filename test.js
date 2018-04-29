var expect = require("chai").expect;
var parser = require("./parser")

describe("XML to JSON parser", function() {


	it("Parse 3-level xml", function() {
		xmlString="<payment>\n\t<amount>10.00</amount>\n\t<from>Evan</from>\n\t<to>\n\t\t<name>Paystand</name>\n\t</to>\n</payment>"

		var result = parser.parseXML(xmlString)
		var jsonResult = JSON.stringify(result)

		var expected = '{"payment":{"amount":"10.00","from":"Evan","to":{"name":"Paystand"}}}'
		expect(jsonResult).to.equal(expected)

	});


	it("Parse xml with unclosed tag", function() {
		xmlString="<payment>\n\t<amount>10.00\n\t<from>Evan</from>\n\t<to>Paystand</to></payment>"
		expect(() => parser.parseXML(xmlString)).to.throw('Error in xml format, new open tag withoug closing previous, ref: from')
	});


	it("Parse xml with unclosed parent tag", function() {
		xmlString="<payment>\n\t<amount>10.00</amount>\n\t<from>Evan</from>\n\t<to>\n\t\t<name>Paystand</name>\n</payment>"
		expect(() => parser.parseXML(xmlString)).to.throw('Error in xml format, closing tag with no opening, ref:/payment')
	});


	it("Parse xml with misspelled closing tag", function() {
		xmlString="<payment>\n\t<amount>10.00</amount>\n\t<from>Evan</fom>\n\t<to>Paystand</to></payment>"
		expect(() => parser.parseXML(xmlString)).to.throw('Error in xml format, tag not closed, tag: from')
	});

});