var select = require('../');
var tokenize = require('html-tokenize');
var fs = require('fs');

var s = select('ul > li dt', function (e) {
    console.log('*** MATCH ***');
    e.createReadStream().on('data', function (row) {
        console.error([ row[0], row[1].toString() ]);
    });
});
fs.createReadStream(__dirname + '/page.html').pipe(tokenize()).pipe(s);
s.resume();
