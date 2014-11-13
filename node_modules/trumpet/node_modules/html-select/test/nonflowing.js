var select = require('../');
var test = require('tape');
var through = require('through2');
var devnull = require('dev-null');

test('non flowing mode', function (t) {
    var expected = {
        h1: [
            [ 'open', '<h1>' ],
            [ 'text', 'whatever' ],
            [ 'close', '</h1>' ],
        ],
    };
    t.plan(expected.h1.length + 1);
    
    var s = select();
    
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
    s.write([ 'text', 'whatever' ]);
    s.write([ 'close', '</h1>' ]);
    s.end();
    s.pipe(devnull({objectMode: true}))
});
