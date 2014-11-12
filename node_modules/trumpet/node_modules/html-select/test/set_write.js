var select = require('../');
var test = require('tape');
var through = require('through2');

test('set and write inner', function (t) {
    var expected = [
        [ 'open', '<html>' ],
        [ 'open', '<body>' ],
        [ 'open', '<a href="/xyz">' ],
        [ 'data', 'beep boop' ],
        [ 'close', '</a>' ],
        [ 'close', '</body>' ],
        [ 'close', '</html>' ]
    ];
    
    t.plan(expected.length);
    var s = select().select('a', function (e) {
        e.setAttribute('href', '/xyz');
        e.createWriteStream({ inner: true }).end([ 'data', 'beep boop' ]);
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<a>' ]);
    s.write([ 'close', '</a>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.pipe(through.obj(function (row, enc, next) {
        t.deepEqual(row, expected.shift());
        next();
    }));
});

test('set and write outer', function (t) {
    var expected = [
        [ 'open', '<html>' ],
        [ 'open', '<body>' ],
        [ 'data', 'beep boop' ],
        [ 'close', '</body>' ],
        [ 'close', '</html>' ]
    ];
    
    t.plan(expected.length);
    var s = select().select('a', function (e) {
        e.setAttribute('href', '/xyz');
        e.createWriteStream().end([ 'data', 'beep boop' ]);
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<a>' ]);
    s.write([ 'close', '</a>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.pipe(through.obj(function (row, enc, next) {
        t.deepEqual(row, expected.shift());
        next();
    }));
});
