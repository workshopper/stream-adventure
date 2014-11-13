var test = require('tape');
var trumpet = require('../');
var through = require('through2');
var concat = require('concat-stream');
var fs = require('fs');
var expected = fs.readFileSync(__dirname + '/loud_expected.html', 'utf8');

test('loud delay', function (t) {
    t.plan(1);
    var tr = trumpet();

    var loud = tr.select('.loud').createStream();
    loud.pipe(through(function (buf, enc, next) {
        var self = this;
        setTimeout(function () {
            self.push(buf.toString().toUpperCase());
            next();
        }, 10);
    })).pipe(loud);
    
    fs.createReadStream(__dirname + '/loud.html')
        .pipe(tr)
        .pipe(concat(function (src) {
            t.equal(src.toString('utf8'), expected);
        }))
    ;
});
