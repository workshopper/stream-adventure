var select = require('../');
var test = require('tape');
var through = require('through2');

test('overlapping transforms', function (t) {
    var expected = [
        [ 'open', '<html>' ],
        [ 'open', '<body>' ],
        [ 'open', '<DIV CLASS="LOUD">' ],
        [ 'open', '<B>' ],
        [ 'text', 'BEEP BOOP' ],
        [ 'close', '</B>' ],
        [ 'open', '>NAPS<' ],
        [ 'text', 'ZYX' ],
        [ 'close', '>NAPS/<' ],
        [ 'close', '</DIV>' ],
        [ 'close', '</body>' ],
        [ 'close', '</html>' ]
    ];
    t.plan(expected.length + 3);
    
    var s = select();
    s.select('.loud', function (e) {
        var d = e.createStream();
        d.pipe(through.obj(function (row, enc, next) {
            this.push([ row[0], row[1].toUpperCase() ]);
            next();
        })).pipe(d);
    });
    s.select('span', function (e) {
        var d = e.createStream();
        d.pipe(through.obj(function (row, enc, next) {
            t.ok(!/[A-Z]/.test(row[1]), 'not upper-case in <span>');
            this.push([ row[0], row[1].split('').reverse().join('') ]);
            next();
        })).pipe(d);
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div class="loud">' ]);
    s.write([ 'open', '<b>' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</b>' ]);
    s.write([ 'open', '<span>' ]);
    s.write([ 'text', 'xyz' ]);
    s.write([ 'close', '</span>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.pipe(through.obj(function (row, enc, next) {
        t.deepEqual(row, expected.shift(), row[1].toString('utf8'));
        next();
    }));
});
