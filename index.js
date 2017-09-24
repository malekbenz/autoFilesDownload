var path = require("path"),
    fs = require('fs'),
    utils = require('./utils');


var url = process.argv[2] || 'https://vs1.someurl/015.mp4';
var distPath = process.argv[3] || __dirname;

if (distPath == __dirname) {
    distPath = path.join(distPath, utils.dirnameFromUrl(url));
    
}

if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
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
    return {
        url: url2,
        filePath: filePath
    }
}

currentFile = extractPath(url)

utils.download(currentFile.url, currentFile.filePath, fileDownload);

function fileDownload(url, filePath) {

    if (fs.statSync(filePath).size > 5000) {
        var file = extractPath(url, true);
        utils.download(file.url, file.filePath, fileDownload);
    } else
        fs.unlinkSync(filePath);

}