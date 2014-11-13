var select = require('../');
var test = require('tape');
var through = require('through2');
var tokenize = require('html-tokenize');
var fs = require('fs');

test('baseline: transform stream', function (t) {
    var expected = [];

    var s = select('li', function (e) {
        tr = e.createStream({ inner: true });
        tr.pipe(through.obj()).pipe(tr);
    });
    readStream()
    .pipe(tokenize())
    .pipe(through.obj(prewrite))
    .pipe(s)
    .pipe(through.obj(write, end));

    function prewrite (row, enc, next) {
        expected.push([ row[0], row[1].toString('utf8') ]);
        this.push(row);
        next();
    }
    function write (row, enc, next) {
        var x = [ row[0], row[1].toString('utf8') ];
        t.deepEqual(x, expected.shift(), x[1]);
        next();
    }
    function end () {
      t.ok(true, 'ended')
      t.end();
    }
});

test('read (outer) to write (outer)', function (t) {
    var expected = [];

    var s = select('li', function (e) {
        rs = e.createReadStream();
        ws = e.createWriteStream();
        rs.pipe(through.obj()).pipe(ws);
    });
    readStream()
    .pipe(tokenize())
    .pipe(through.obj(prewrite))
    .pipe(s)
    .pipe(through.obj(write, end));

    function prewrite (row, enc, next) {
        expected.push([ row[0], row[1].toString('utf8') ]);
        this.push(row);
        next();
    }
    function write (row, enc, next) {
        var x = [ row[0], row[1].toString('utf8') ];
        t.deepEqual(x, expected.shift(), x[1]);
        next();
    }
    function end () {
      t.ok(true, 'ended')
      t.end();
    }
});

test('read inner to write inner', function (t) {
    var expected = [];

    var s = select('li', function (e) {
        rs = e.createReadStream({ inner: true });
        ws = e.createWriteStream({ inner: true });
        rs.pipe(through.obj()).pipe(ws);
    });
    readStream()
    .pipe(tokenize())
    .pipe(through.obj(prewrite))
    .pipe(s)
    .pipe(through.obj(write, end));

    function prewrite (row, enc, next) {
        expected.push([ row[0], row[1].toString('utf8') ]);
        this.push(row);
        next();
    }
    function write (row, enc, next) {
        var x = [ row[0], row[1].toString('utf8') ];
        t.deepEqual(x, expected.shift(), x[1]);
        next();
    }
    function end () {
      t.ok(true, 'ended')
      t.end();
    }
});

function readStream () {
    var s = through();
    s.end('<ul><li>item1</li><li>item2</li></ul>');
    return s;
}
