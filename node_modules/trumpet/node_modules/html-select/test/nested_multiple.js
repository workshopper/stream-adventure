var select = require('../');
var test = require('tape');
var tokenize = require('html-tokenize');
var fs = require('fs');

test('nested divs', function (t) {
    var s = select();
    var expected = [
        '<ul>',
        '<li>',
        '<li>',
    ];
    t.plan(expected.length);
    s.select('ul', function (e) {
        e.createReadStream().once('data', function (r) {
            t.equal(r[1].toString(), expected.shift());
        });
    });
    s.select('li', function (e) {
        e.createReadStream().once('data', function (r) {
            t.equal(r[1].toString(), expected.shift());
        });
    });
    fs.createReadStream(__dirname + '/nested_multiple/index.html')
        .pipe(tokenize()).pipe(s)
    ;
    s.resume();
});
