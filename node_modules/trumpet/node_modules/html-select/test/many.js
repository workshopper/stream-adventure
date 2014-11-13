var select = require('../');
var test = require('tape');
var through = require('through2');

test('many read streams', function (t) {
    var expected = {
        b: [
            [ 'open', '<b>' ],
            [ 'text', 'beep boop' ],
            [ 'close', '</b>' ],
            [ 'open', '<b x=555>' ],
            [ 'text', 'eek' ],
            [ 'close', '</b>' ]
        ],
        h1: [
            [ 'open', '<h1>' ],
            [ 'text', 'whatever' ],
            [ 'close', '</h1>' ],
        ],
    };
    t.plan(expected.b.length + expected.h1.length + 3);
    
    var s = select();
    s.select('div b', function (e) {
        e.on('close', function () { t.ok(true, 'closed') });
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.b.shift());
            next();
        }));
    });
    
    s.select('h1', function (e) {
        e.on('close', function () { t.ok(true, 'closed') });
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.h1.shift());
            next();
        }));
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</b>' ]);
    s.write([ 'close', '<div>' ]);
    
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<h1>' ]);
    s.write([ 'text', 'whatever' ]);
    s.write([ 'close', '</h1>' ]);
    s.write([ 'close', '<div>' ]);
    
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b x=555>' ]);
    s.write([ 'text', 'eek' ]);
    s.write([ 'close', '</b>' ]);
    s.write([ 'close', '<div>' ]);
    s.write([ 'close', '<div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
