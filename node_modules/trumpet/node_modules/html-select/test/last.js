var select = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');
var through = require('through2');
var tokenize = require('html-tokenize');

test('last', function (t) {
console.error(':LAST-CHILD selector disabled for now');
return t.end();
    t.plan(2);
    var expected = [ 'CCC', 'EEE' ];
    var sel = select();
    sel.select('.row *:last-child', function (elem) {
        var ex = expected.shift();
        var strip = through.obj(function (row, enc, next) {
            this.push(row[1]);
            next();
        });
        elem.createReadStream({ inner: true })
            .pipe(strip)
            .pipe(concat(function (body) {
                t.equal(body.toString('utf8'), ex);
            }))
        ;
    });
    fs.createReadStream(__dirname + '/last/index.html')
        .pipe(tokenize())
        .pipe(sel)
    ;
});
