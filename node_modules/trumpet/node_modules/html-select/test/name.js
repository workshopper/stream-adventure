var select = require('../');
var test = require('tape');
var through = require('through2');

test('names', function (t) {
    t.plan(3);
    var s = select().select('div', function (e) {
        t.equal(e.name, 'div');
    });
    
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<Div class="a">' ]);
    s.write([ 'open', '<dIv class="b">' ]);
    s.write([ 'open', '<diV class="c">' ]);
    s.write([ 'text', 'beep boop' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    
    s.resume();
});
