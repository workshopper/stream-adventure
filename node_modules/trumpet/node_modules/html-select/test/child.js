var select = require('../');
var test = require('tape');
var fs = require('fs');
var path = require('path');
var through = require('through2');
var tokenize = require('html-tokenize');

test('child selector', function (t) {
    var expected = [ [ 'open', Buffer('<input type="text" value="abc">') ] ];
    t.plan(expected.length);
    var s = select();
    s.select('.c > input[type=text]', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    readStream('child/index.html').pipe(tokenize()).pipe(s);
    s.resume();
});

test('child selector non-immediate descendant', function (t) {
    var expected = [
        [ 'open', Buffer('<div class="e">') ],
        [ 'text', Buffer('xyz') ],
        [ 'close', Buffer('</div>') ]
    ];
    t.plan(expected.length);
    var s = select();
    s.select('.b > .e', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    readStream('child/index.html').pipe(tokenize()).pipe(s);
    s.resume();
});

test('child no-match selector', function (t) {
    var s = select();
    s.select('.b > input[type=text]', function (e) {
        t.fail('should not have matched');
    });
    readStream('child/index.html').pipe(tokenize()).pipe(s);
    s.on('finish', function () { t.end() });
    s.resume();
});

test('child start then no match selector', function (t) {
    var s = select();
    s.select('.b > .d', function (e) {
        t.fail('should not have matched');
    });
    readStream('child/index.html').pipe(tokenize()).pipe(s);
    s.on('finish', function () { t.end() });
    s.resume();
});

function readStream (file) {
    return fs.createReadStream(path.join(__dirname, file));
}
