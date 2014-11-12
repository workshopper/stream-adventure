var test = require('tape');
var select = require('../');
var tokenize = require('html-tokenize');
var through = require('through2');
var fs = require('fs');

var expected = require('./loud_delay/expected.json');

test('loud delay', function (t) {
    t.plan(expected.length);
    
    var s = select();
    s.select('.loud', function (elem) {
        var loud = elem.createStream();
        loud.pipe(through.obj(function (row, enc, next) {
            var self = this;
            setTimeout(function () {
                self.push([ 'data', row[1].toString().toUpperCase() ]);
                next();
            }, 10);
        })).pipe(loud);
    });
    
    fs.createReadStream(__dirname + '/loud_delay/input.html')
        .pipe(tokenize())
        .pipe(s)
        .pipe(through.obj(function (row, enc, next) {
            var r = [ row[0], row[1].toString('utf8') ];
            t.deepEqual(r, expected.shift());
            next();
        }))
    ;
});
