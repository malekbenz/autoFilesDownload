var numberPattern = /\d+$/g;

var url =  process.argv[2] || 'bba3401';
var dir =  process.argv[3] || __dirname;
console.log(__dirname)

var result = url.match(numberPattern);

result = result ? result[0]: "fateh" ;
console.log(result);


