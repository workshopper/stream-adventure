var select = require('../');
var test = require('tape');
var through = require('through2');


test('self-closing tag without trailing slash', function (t) {
    var expected = [
        [ 'open', '<div class="target">'],
        [ 'open', '<br>' ],
        [ 'close', '</div>']
    ];
    t.plan(expected.length);
    var s = select('div.target', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div class="target">' ]);
    s.write([ 'open', '<br>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'open', '<div class="extra">']);
    s.write([ 'close', '</div>']);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('self-closing tag with trailing slash', function (t) {
    var expected = [
        [ 'open', '<div class="target">'],
        [ 'open', '<br/>' ],
        [ 'close', '</div>']
    ];
    t.plan(expected.length);
    var s = select('div.target', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div class="target">' ]);
    s.write([ 'open', '<br/>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'open', '<div class="extra">']);
    s.write([ 'close', '</div>']);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('nested selection of self-closing tag', function (t) {
    var expected = [
        [ 'open', '<div class="target">'],
        [ 'open', '<br>' ],
        [ 'open', '<br>' ],
        [ 'close', '</div>']
    ];
    t.plan(expected.length);
    var s = select();
    s.select('div.target', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.select('br', function(e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual(row, expected.shift());
            next();
        }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div class="target">' ]);
    s.write([ 'open', '<br>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'open', '<div class="extra">']);
    s.write([ 'close', '</div>']);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});


test('self-closing tag with attribute and trailing slash -- tree structure', function (t) {
    var expected = [
      [ 'open', '<div class="target">'],
      [ 'open', '<img src="arrow.jpg"/>' ],
      [ 'close', '</div>']
    ];
    t.plan(expected.length);
    var s = select('div.target', function (e) {
      e.createReadStream().pipe(through.obj(function (row, enc, next) {
          t.deepEqual(row, expected.shift());
          next();
      }));
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div class="target">' ]);
    s.write([ 'open', '<img src="arrow.jpg"/>' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'open', '<div class="extra">']);
    s.write([ 'close', '</div>']);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});


test('self-closing tag with attribute and trailing slash -- attributes', function (t) {
    var expected = [
      {'src': 'arrow.jpg'}
    ];
    t.plan(expected.length);
    var s = select('img', function (e) {
      t.deepEqual(e.getAttributes(), expected.shift());
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<div class="target">' ]);
    s.write([ 'open', '<img src="arrow.jpg" />' ]);
    s.write([ 'close', '</div>' ]);
    s.write([ 'open', '<div class="extra">']);
    s.write([ 'close', '</div>']);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
