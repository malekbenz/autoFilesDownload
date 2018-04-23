
var path = require("path"),
    fs = require('fs'),
    utils = require('./utils');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'src', alias: 's', defaultOption: true, type: String },
    { name: 'dest', alias: 'd', type: String },
    { name: 'autoname', type: Boolean },
    { name: 'day', type: Boolean },
    { name: 'week', type: Boolean },
    { name: 'weekname', type: Boolean },

    { name: 'all', type: Boolean },
];

const options = commandLineArgs(optionDefinitions)

console.log('options', options);

var jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

var url = options['src'] || 'https://vs1.someurl/015.mp4';
var distPath = options['dest'] || __dirname;
var all = options['all'] || false;

var day = (new Date).getDate();
var autoName = options['autoname'] || false;
var weekName = options['weekname'] || false;

if (options['day']) {
    day = (new Date).getDate();
}
if (options['week']) {
    day = (new Date).getDay() + 1;
}
if (options['weekname']) {
    day = (new Date).getDay();
    day = jours[day];
}
distPath = path.join(distPath, day.toString());


console.log(day);
console.log(distPath);

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