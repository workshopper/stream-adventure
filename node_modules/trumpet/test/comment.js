var trumpet = require('../');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('comment write stream', function (t) {
    t.plan(1);

    var tr = trumpet();
    var html = tr.select('html');
    var ws = html.createWriteStream();

    var s = through();
    s.pipe(ws);
    s.end();

    var res = '<!-- test --><html></html>';
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            res
        );
    }));
    tr.end(res);
});

test('comment write stream variant', function (t) {
    t.plan(1);

    var tr = trumpet();
    var html = tr.select('html');
    var ws = html.createWriteStream();

    var s = through();
    s.pipe(ws);
    s.end();

    var res = '<!--test   --><html></html>';
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            res
        );
    }));
    tr.end(res);
});
