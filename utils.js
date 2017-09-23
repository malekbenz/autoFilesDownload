var request = require('request'),
    progress = require('request-progress'),
    colors = require('colors')
    fs = require('fs');


var numberPattern = /\d+$/g;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function pad(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

console.reset = function () {
    return process.stdout.write('\033c');
}


function getNext(name) {
    var number = name.match(numberPattern)[0];
    var length = number.length;
    return pad(++number, length);


}

function download(url, filePath, callback) {

    return progress(request(url), {
            throttle: 2000, // Throttle the progress event to 2000ms, defaults to 1000ms
            delay: 1000 // Only start to emit after 1000ms delay, defaults to 0ms
            // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
        })
        .on('progress', function (state) {
            console.reset();
            console.log('File Name: '.green, url);
            console.log('percent : '.yellow, Math.floor(state.percent * 100) + " %");
            console.log('speed : ', Math.floor(state.speed / 1000) + " kb");
            console.log('Total size :', numberWithCommas(Math.floor(state.size.total / 1000)) + ' kb' );
            console.log('transferred :', numberWithCommas(Math.floor(state.size.transferred / 1000)) + ' kb');

            // console.log('time', state.time.elapsed);
            // console.log('Rest ', state.time.remaining);
        })
        .on('error', function (err) {
            // Do something with err
        })
        .on('end', function () {
            console.log("Finish dowloading ");
            callback(url, filePath);
        })
        .pipe(fs.createWriteStream(filePath));

}

module.exports = {
    getNext: getNext,
    download: download
}