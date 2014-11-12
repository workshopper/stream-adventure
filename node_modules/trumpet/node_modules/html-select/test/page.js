var select = require('../');
var test = require('tape');
var tokenize = require('html-tokenize');
var fs = require('fs');
var through = require('through2');

test('page .content', function (t) {
    var expected = [
        [ 'open', Buffer('<div class="content">') ],
        [ 'text', Buffer('\n      ') ],
        [ 'open', Buffer('<span class="greeting">') ],
        [ 'text', Buffer('beep boop') ],
        [ 'close', Buffer('</span>') ],
        [ 'text', Buffer('\n      ') ],
        [ 'open', Buffer('<span class="name">') ],
        [ 'text', Buffer('robot') ],
        [ 'close', Buffer('</span>') ],
        [ 'text', Buffer('\n    ') ],
        [ 'close', Buffer('</div>') ]
    ];
    t.plan(expected.length);
    var s = select('.content', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    readStream().pipe(tokenize()).pipe(s);
    s.resume();
});

test('page *', function (t) {
    var expected = [
        [ 'open', Buffer('<span class="greeting">') ],
        [ 'text', Buffer('beep boop') ],
        [ 'close', Buffer('</span>') ],
        [ 'open', Buffer('<span class="name">') ],
        [ 'text', Buffer('robot') ],
        [ 'close', Buffer('</span>') ]
    ];
    t.plan(expected.length + 2);
    var s = select('.content *', function (e) {
        t.ok(true, 'match');
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    readStream().pipe(tokenize()).pipe(s);
    s.resume();
});

test('page div.content', function (t) {
    var expected = [
        [ 'open', Buffer('<div class="content">') ],
        [ 'text', Buffer('\n      ') ],
        [ 'open', Buffer('<span class="greeting">') ],
        [ 'text', Buffer('beep boop') ],
        [ 'close', Buffer('</span>') ],
        [ 'text', Buffer('\n      ') ],
        [ 'open', Buffer('<span class="name">') ],
        [ 'text', Buffer('robot') ],
        [ 'close', Buffer('</span>') ],
        [ 'text', Buffer('\n    ') ],
        [ 'close', Buffer('</div>') ]
    ];
    t.plan(expected.length);
    var s = select('div.content', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    readStream().pipe(tokenize()).pipe(s);
    s.resume();
});

test('page .name', function (t) {
    var expected = [
        [ 'open', Buffer('<h1 class="name">') ],
        [ 'text', Buffer('whoa') ],
        [ 'close', Buffer('</h1>') ],
        [ 'open', Buffer('<span class="name">') ],
        [ 'text', Buffer('robot') ],
        [ 'close', Buffer('</span>') ],
    ];
    t.plan(expected.length);
    var s = select('.name', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    readStream().pipe(tokenize()).pipe(s);
    s.resume();
});

test('page span.greeting', function (t) {
    var expected = [
        [ 'open', Buffer('<span class="greeting">') ],
        [ 'text', Buffer('beep boop') ],
        [ 'close', Buffer('</span>') ],
    ];
    t.plan(expected.length);
    var s = select('span.greeting', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    readStream().pipe(tokenize()).pipe(s);
    s.resume();
});

test('page .content span', function (t) {
    var expected = [
        [ 'open', Buffer('<span class="greeting">') ],
        [ 'text', Buffer('beep boop') ],
        [ 'close', Buffer('</span>') ],
        [ 'open', Buffer('<span class="name">') ],
        [ 'text', Buffer('robot') ],
        [ 'close', Buffer('</span>') ]
    ];
    t.plan(expected.length);
    var s = select('.content span', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    readStream().pipe(tokenize()).pipe(s);
    s.resume();
});

function readStream () {
    return fs.createReadStream(__dirname + '/page/index.html');
}
