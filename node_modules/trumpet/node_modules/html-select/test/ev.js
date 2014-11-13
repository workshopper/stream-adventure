var select = require('../');
var test = require('tape');
var through = require('through2');

test('events', function (t) {
    var expected = [
        [ 'open', '<b x=5>' ],
        [ 'text', 'beep boop' ],
        [ 'close', '</b>' ]
    ];
    t.plan(expected.length + 1);
    var s = select();
    s.select('div b', function (e) {
        e.on('close', function () {
            t.ok(true, 'close event');
        });
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b x=5>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</b>' ]);
    s.write([ 'close', '<div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
