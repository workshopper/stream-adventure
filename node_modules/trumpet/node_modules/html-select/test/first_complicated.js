var select = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');
var through = require('through2');
var tokenize = require('html-tokenize');

test('first complicated', function (t) {
    var expected = [
        '<div class="a">AAA</div>'
        + '<div class="b">BBB</div>'
        + '<div class="c">CCC</div>',
        'AAA', 'DDD', 'FFF'
    ];
    t.plan(expected.length);
    
    var sel = select();
    sel.select('.row *:first-child', function (elem) {
        var ex = expected.shift();
        var strip = through.obj(function (row, enc, next) {
            this.push(row[1]);
            next();
        });
        elem.createReadStream({ inner: true })
            .pipe(strip)
            .pipe(concat(function (body) {
                t.equal(body.toString('utf8').replace(/(^|\n)\s*/g, ''), ex);
            }))
        ;
    });
    fs.createReadStream(__dirname + '/first_complicated/index.html')
        .pipe(tokenize())
        .pipe(sel)
    ;
});
