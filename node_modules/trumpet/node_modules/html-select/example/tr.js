var select = require('../');
var tokenize = require('html-tokenize');
var through = require('through2');
var fs = require('fs');

var s = select('dt', function (e) {
    var tr = through.obj(function (row, enc, next) {
        this.push([ row[0], String(row[1]).toUpperCase() ]);
        next();
    });
    tr.pipe(e.createStream()).pipe(tr);
});

fs.createReadStream(__dirname + '/page.html')
    .pipe(tokenize())
    .pipe(s)
    .pipe(through.obj(function (row, buf, next) {
        this.push(row[1]);
        next();
    }))
    .pipe(process.stdout)
;
