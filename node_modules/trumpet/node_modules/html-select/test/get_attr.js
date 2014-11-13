var select = require('../');
var test = require('tape');
var through = require('through2');

test('get an attribute', function (t) {
    var expected = [ 'a', 'b', 'c' ];
    t.plan(expected.length * 2);
    
    var s = select().select('div', function (e) {
        t.equal(e.name, 'div');
        t.equal(e.getAttribute('class'), expected.shift());
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
    
    s.resume();
});

test('get a self-closing attribute', function (t) {
    var expected = [ 'submit', 'text' ];
    t.plan(expected.length);
    
    var s = select().select('input', function (e) {
        t.equal(e.getAttribute('type'), expected.shift());
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<input type="submit">' ]);
    s.write([ 'open', '<input type="text">' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.resume();
});

test('get attributes', function (t) {
    var expected = [
        { type: 'text', value: 'turtle rap' },
        { type: 'submit', value: 'go ninja go' },
    ];
    t.plan(expected.length);
    
    var s = select().select('input', function (e) {
        t.deepEqual(e.getAttributes(), expected.shift());
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<form>' ]);
    s.write([ 'open', '<input type="text" value="turtle rap">' ]);
    s.write([ 'open', '<input type="submit" value="go ninja go">' ]);
    s.write([ 'close', '</form>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.resume();
});
