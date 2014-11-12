var select = require('../');
var test = require('tape');
var through = require('through2');
var devnull = require('dev-null');

test('non flowing mode with overlap', function (t) {
    var expected = {
        a:  [
            [ 'open', '<a>' ],
            [ 'text', 'whatever' ],
            [ 'close', '</a>' ],
        ],
        h1: [
            [ 'open', '<h1>' ],
            [ 'open', '<a>' ],
            [ 'text', 'whatever' ],
            [ 'close', '</a>' ],
            [ 'close', '</h1>' ],
        ],
    };
    t.plan(expected.a.length + expected.h1.length + 2);
    
    var s = select();
    
    s.select('a', function (e) {
        e.on('close', function () { t.ok(true, 'closed') });
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.a.shift());
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
   
    // write garbage to force buffering
    for (var i=0; i<64; i++) {
      s.write([ 'open', '<garbage>' ]);
    }
 
    s.write([ 'open', '<h1>' ]);
    s.write([ 'open', '<a>' ]);
    s.write([ 'text', 'whatever' ]);
    s.write([ 'close', '</a>' ]);
    s.write([ 'close', '</h1>' ]);
    s.end();
    s.pipe(devnull({objectMode: true}))
});
