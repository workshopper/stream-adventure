var select = require('../');
var test = require('tape');
var through = require('through2');

test('overlapping inner transforms', function (t) {
    var expected = [
        [ 'open', '<html>' ],
        [ 'open', '<body>' ],
        [ 'open', '<div class="loud">' ],
        [ 'open', '<B>' ],
        [ 'text', 'BEEP BOOP' ],
        [ 'close', '</B>' ],
        [ 'open', '<SPAN>' ],
        [ 'text', 'ZYX' ],
        [ 'close', '</SPAN>' ],
        [ 'close', '</div>' ],
        [ 'close', '</body>' ],
        [ 'close', '</html>' ]
    ];
    t.plan(expected.length);
    
    var s = select();
    s.select('.loud', function (e) {
        var d = e.createStream({ inner: true });
        d.pipe(through.obj(function (row, enc, next) {
            this.push([ row[0], row[1].toUpperCase() ]);
            next();
        })).pipe(d);
    });
    s.select('span', function (e) {
        var d = e.createStream({ inner: true });
        d.pipe(through.obj(function (row, enc, next) {
            var tr = this;
            setTimeout(function () {
                tr.push([ row[0], row[1].split('').reverse().join('') ]);
                next();
            }, 50);
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
