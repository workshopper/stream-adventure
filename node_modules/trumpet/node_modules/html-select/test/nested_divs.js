var select = require('../');
var test = require('tape');
var tokenize = require('html-tokenize');
var through = require('through2');
var fs = require('fs');

test('nested divs', function (t) {
    var s = select();
    var expected = [
        '<div    class = "a"  id="z"      >',
        '<div class="b">'
    ];
    t.plan(expected.length);
    s.select('div', function (e) {
        e.createReadStream().once('data', function (r) {
            t.equal(r[1].toString(), expected.shift());
        });
    });
    fs.createReadStream(__dirname + '/nested_divs/index.html')
        .pipe(tokenize()).pipe(s)
    ;
    s.resume();
});
