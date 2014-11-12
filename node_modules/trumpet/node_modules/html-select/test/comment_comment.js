var select = require('../');
var test = require('tape');
var through = require('through2');

test('comment comment', function (t) {
    var expected = [
        [ 'text', 'stomping on this tiny house' ],
    ];
    t.plan(expected.length);
    var s = select('html', function (e) {
        e.createReadStream({ inner: true })
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
    });
    s.write([ 'open', '<!--' ]);
    s.write([ 'text', '<!-- beep boop' ]);
    s.write([ 'close', '-->' ]);
    s.write([ 'open', '<html>' ]);
    s.write([ 'text', 'stomping on this tiny house' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
