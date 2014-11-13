var select = require('../');
var test = require('tape');
var through = require('through2');

test('star', function (t) {
    var expected = [
        [
            [ 'open', '<html>' ],
            [ 'open', '<body>' ],
            [ 'open', '<div>' ],
            [ 'open', '<b>' ],
            [ 'text', 'beep boop' ],
            [ 'close', '</b>' ],
            [ 'text', '\n' ],
            [ 'open', '<div class="x">' ],
            [ 'text', 'woo' ],
            [ 'close', '</div>' ],
            [ 'text', '\n' ],
            [ 'close', '</div>' ],
            [ 'close', '</body>' ],
            [ 'close', '</html>' ]
        ],
        [
            [ 'open', '<body>' ],
            [ 'open', '<div>' ],
            [ 'open', '<b>' ],
            [ 'text', 'beep boop' ],
            [ 'close', '</b>' ],
            [ 'text', '\n' ],
            [ 'open', '<div class="x">' ],
            [ 'text', 'woo' ],
            [ 'close', '</div>' ],
            [ 'text', '\n' ],
            [ 'close', '</div>' ],
            [ 'close', '</body>' ]
        ],
        [
            [ 'open', '<div>' ],
            [ 'open', '<b>' ],
            [ 'text', 'beep boop' ],
            [ 'close', '</b>' ],
            [ 'text', '\n' ],
            [ 'open', '<div class="x">' ],
            [ 'text', 'woo' ],
            [ 'close', '</div>' ],
            [ 'text', '\n' ],
            [ 'close', '</div>' ]
        ],
        [
            [ 'open', '<b>' ],
            [ 'text', 'beep boop' ],
            [ 'close', '</b>' ]
        ],
        [
            [ 'open', '<div class="x">' ],
            [ 'text', 'woo' ],
            [ 'close', '</div>' ]
        ]
    ];
    t.plan(expected.length);
    
    var s = select('*', function (e) {
        var ex = expected.shift();
        var rows = [];
        function write (row, enc, next) { rows.push(row); next() }
        function end () { t.deepEqual(rows, ex); }
        e.createReadStream().pipe(through.obj(write, end));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div>' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</b>' ]);
    s.write([ 'text', '\n' ]);
    s.write([ 'open', '<div class="x">' ]);
    s.write([ 'text', 'woo' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'text', '\n' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
