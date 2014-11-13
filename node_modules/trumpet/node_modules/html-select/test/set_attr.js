var select = require('../');
var test = require('tape');
var through = require('through2');

test('set an attribute', function (t) {
    var expected = [
        [ 'open', '<html>' ],
        [ 'open', '<body>' ],
        [ 'open', '<input type="submit">' ],
        [ 'open', '<input type="text" value="beep boop">' ],
        [ 'close', '</body>' ],
        [ 'close', '</html>' ]
    ];
    
    t.plan(expected.length);
    var s = select().select('input[type="text"]', function (e) {
        e.setAttribute('value', 'beep boop');
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<input type="submit">' ]);
    s.write([ 'open', '<input type="text">' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.pipe(through.obj(function (row, enc, next) {
        t.deepEqual(row, expected.shift());
        next();
    }));
});

test('set multiple attributes', function (t) {
    var expected = [
        [ 'open', '<html>' ],
        [ 'open', '<body>' ],
        [ 'open', '<div class="a" n="0">' ],
        [ 'open', '<div class="b" n="1">' ],
        [ 'open', '<div class="c" n="2">' ],
        [ 'text', 'beep boop' ],
        [ 'close', '</div>' ],
        [ 'close', '</div>' ],
        [ 'close', '</div>' ],
        [ 'close', '</body>' ],
        [ 'close', '</html>' ]
    ];
    
    t.plan(expected.length);
    var n = 0;
    var s = select().select('div', function (e) {
        e.setAttribute('n', String(n++));
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div class="a">' ]);
    s.write([ 'open', '<div class="b">' ]);
    s.write([ 'open', '<div class="c">' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.pipe(through.obj(function (row, enc, next) {
        t.deepEqual(row, expected.shift());
        next();
    }));
});

test('selectively set attributes', function (t) {
    var expected = [
        [ 'open', '<html>' ],
        [ 'open', '<body>' ],
        [ 'open', '<div class="a" n="0">' ],
        [ 'open', '<div class="b">' ],
        [ 'open', '<div class="c" n="1">' ],
        [ 'open', '<div class="d" n="2">' ],
        [ 'open', '<div class="e">' ],
        [ 'text', 'beep boop' ],
        [ 'close', '</div>' ],
        [ 'close', '</div>' ],
        [ 'close', '</div>' ],
        [ 'close', '</div>' ],
        [ 'close', '</div>' ],
        [ 'close', '</body>' ],
        [ 'close', '</html>' ]
    ];
    
    t.plan(expected.length);
    var n = 0;
    var s = select().select('div', function (e) {
        if (/[acd]/.test(e.getAttribute('class'))) {
            e.setAttribute('n', String(n++));
        }
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div class="a">' ]);
    s.write([ 'open', '<div class="b">' ]);
    s.write([ 'open', '<div class="c">' ]);
    s.write([ 'open', '<div class="d">' ]);
    s.write([ 'open', '<div class="e">' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.pipe(through.obj(function (row, enc, next) {
        t.deepEqual(row, expected.shift());
        next();
    }));
});
