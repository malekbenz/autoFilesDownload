var path = require("path"),
    fs = require('fs'),
    utils = require('./utils');
const commandLineArgs = require('command-line-args');
const cheerio = require("cheerio");

const optionDefinitions = [{
        name: 'src',
        alias: 's',
        defaultOption: true,
        type: String
    },
    {
        name: 'dest',
        alias: 'd',
        type: String
    }

];

const options = commandLineArgs(optionDefinitions)

console.log('options', options);

var url = options['src'] || 'https://vs1.someurl/015.mp4';
var distPath = options['dest'] || __dirname;
var all = options['all'] || false;

var autoName = options['autoname'] || false;


distPath = path.join(distPath, day.toString());

console.log(distPath);

if (distPath == __dirname) {
    distPath = path.join(distPath, utils.dirnameFromUrl(url));

}

if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

function extractUrls(html){
	const $ = cheerio.load(html );
	const result = $("script[type='application/ld+json']");
	var data = result[0].children[0].data;
	data = JSON.parse(data);
	const urls = data["@graph"].map(x=> ({url :x.url, name: x.name}))
	console.log(urls);
	return urls;
}

function extractPath(url, next) {

    var ext = path.extname(url);
    var fileName = path.basename(url, ext);
    var url = path.dirname(url);

    if (next) {
        var url2 = url + '/' + utils.getNext(fileName) + ext;
        var filePath = path.join(distPath, utils.getNext(fileName) + ext);
        return {
            url: url2,
            filePath: filePath
        }

    }
    var url2 = url + '/' + fileName + ext;
    var filePath = path.join(distPath, fileName + ext);

    if (autoName) { // replace with the file name with date 
        fileName = (new Date()).toLocaleDateString();
        filePath = path.join(distPath, fileName + ext);
    }

    return {
        url: url2,
        filePath: filePath
    }
}

currentFile = extractPath(url)

fetch('https://coursehunter.net/course/go-dlya-javascript-razrabotchikov')
	.then(x=> x.text())
	.then((response)=> {
		extractUrls(response);
	})


utils.download(currentFile.url, currentFile.filePath, fileDownload);

function fileDownload(url, filePath) {

    if (!all) {
        return
    }
    if (fs.statSync(filePath).size > 5000) {
        var file = extractPath(url, all);
        utils.download(file.url, file.filePath, fileDownload);
    } else
        fs.unlinkSync(filePath);

}
