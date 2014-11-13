var select = require('../');
var test = require('tape');
var through = require('through2');

test('quoted attribute', function (t) {
    var expected = [
        [
            [ 'open', '<div class="a">' ],
            [ 'test', '\n' ],
            [ 'open', '<div class="b">' ],
            [ 'test', '\n' ],
            [ 'close', '</div>' ],
            [ 'test', '\n' ],
            [ 'close', '</div>' ]
        ],
        [
            [ 'open', '<div class="b">' ],
            [ 'test', '\n' ],
            [ 'close', '</div>' ]
        ]
    ];
    t.plan(expected.reduce(function (sum, x) { return sum + x.length }, 0));
    
    var s = select().select('div', function (e) {
        var ex = expected.shift();
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, ex.shift());
                next();
            }))
        ;
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'test', '\n' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'test', '\n' ]);
    s.write([ 'open', '<div class="a">' ]);
    s.write([ 'test', '\n' ]);
    s.write([ 'open', '<div class="b">' ]);
    s.write([ 'test', '\n' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'test', '\n' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'test', '\n' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
