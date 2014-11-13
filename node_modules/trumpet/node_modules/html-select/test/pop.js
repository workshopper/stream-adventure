var select = require('../');
var test = require('tape');
var through = require('through2');

test('more closes than opens', function (t) {
    var expected = [
        [ 'open', '<b>' ],
        [ 'text', 'beep boop' ],
        [ 'close', '</b>' ]
    ];
    t.plan(expected.length);
    var s = select('div b', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</b>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</quote>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('implicit close', function (t) {
    var expected = [
        [ 'open', '<b>' ],
        [ 'text', 'beep boop' ]
    ];
    t.plan(expected.length);
    var s = select('div b', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('implicit close duplex', function (t) {
    var expected = [
        [ 'open', '<b>' ],
        [ 'text', 'beep boop' ]
    ];
    t.plan(expected.length);
    var s = select('div b', function (e) {
        var s = e.createStream();
        s.pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        })).pipe(s);
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('implicit close outer content', function (t) {
    var expected = [
        [ 'open', '<div>' ],
        [ 'open', '<b>' ],
        [ 'text', 'beep boop' ],
        [ 'close', '</div>' ]
    ];
    t.plan(expected.length);
    var s = select('div', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('implicit closing and resuming', function (t) {
console.log('SKIP');
return t.end();
    var expected = [
        [ 'open', '<i>' ],
        [ 'text', 'pizza' ],
        [ 'close', '</i>' ]
    ];
    t.plan(expected.length);
    var s = select('div > i', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<span>' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</span>' ]);
    s.write([ 'open', '<i>' ]);
    s.write([ 'text', 'pizza' ]);
    s.write([ 'close', '</i>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
