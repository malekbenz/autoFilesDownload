var request = require('request');
const fetch = require('node-fetch');
const cheerio = require("cheerio");
console.log(__dirname)


fetch('https://coursehunter.net/course/go-dlya-javascript-razrabotchikov')
	.then(x=> x.text())
	.then((response)=> {
		extractUrls(response);
	})



function extractUrls(html){
	const $ = cheerio.load(html );
	const result = $("script[type='application/ld+json']");
	var data = result[0].children[0].data;
	data = JSON.parse(data);
	//console.log(data);
	const urls = data["@graph"].map(x=> ({url :x.url, name: x.name}))
	console.log(urls);
	return urls;
}

