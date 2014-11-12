var select = require('../');
var test = require('tape');
var through = require('through2');

test('inner read stream', function (t) {
    var expected = [
        [ 'text', 'beep boop' ]
    ];
    t.plan(expected.length);
    var s = select('div b', function (e) {
        e.createReadStream({ inner: true })
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'text', 'whoa' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</b>' ]);
    s.write([ 'close', '<div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
