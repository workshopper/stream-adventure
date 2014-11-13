var select = require('../');
var test = require('tape');
var through = require('through2');

test('quoted attribute', function (t) {
    var expected = [ [ 'open', '<input type="text">' ] ];
    t.plan(expected.length);
    var s = select().select('input[type="text"]', function (e) {
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
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

test('bare attribute', function (t) {
    var expected = [ [ 'open', '<input type="text">' ] ];
    t.plan(expected.length);
    var s = select();
    s.select('input[type=text]', function (e) {
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
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

test('mixed case attribute', function (t) {
    var expected = [ [ 'open', '<input tYPe="text">' ] ];
    t.plan(expected.length);
    var s = select();
    s.select('input[type=text]', function (e) {
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<input type="submit">' ]);
    s.write([ 'open', '<input tYPe="text">' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('mixed case [attribute]', function (t) {
    var expected = [ [ 'open', '<input type="text">' ] ];
    t.plan(expected.length);
    var s = select();
    s.select('input[TypE=text]', function (e) {
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
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

test('trailing whitespace attribute', function (t) {
    var expected = [ [ 'open', '<input type="text" value ="xyz">' ] ];
    t.plan(expected.length);
    var s = select();
    s.select('input[TypE=text]', function (e) {
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<input type="submit">' ]);
    s.write([ 'open', '<input type="text" value ="xyz">' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('attribute extra whitespace', function (t) {
    var expected = [ [ 'open', '<input type="text"   value   =     xyz    >' ] ];
    t.plan(expected.length);
    var s = select();
    s.select('input[TypE=text]', function (e) {
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<input type="submit">' ]);
    s.write([ 'open', '<input type="text"   value   =     xyz    >' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('attribute whitespace around quotes', function (t) {
    var expected = [ [ 'open', '<input type="text"   value   =     "xyz"    >' ] ];
    t.plan(expected.length);
    var s = select();
    s.select('input[type=text]', function (e) {
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<input type="submit">' ]);
    s.write([ 'open', '<input type="text"   value   =     "xyz"    >' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});

test('exact attribute value with spaces', function (t) {
    var expected = [
        [ 'open', '<img class="a b c">' ]
    ];
    t.plan(expected.length);
    
    var s = select('img[class="a b c"]', function (e) {
        e.createReadStream()
            .pipe(through.obj(function (row, enc, next) {
                t.deepEqual(row, expected.shift());
                next();
            }))
        ;
    });
    s.write([ 'open', '<html>' ]);
    s.write([ 'open', '<body>' ]);
    s.write([ 'open', '<img class="a">' ]);
    s.write([ 'open', '<img class="abc">' ]);
    s.write([ 'open', '<img class="a b c d">' ]);
    s.write([ 'open', '<img class="a b c">' ]);
    s.write([ 'close', '</body>' ]);
    s.write([ 'close', '</html>' ]);
    s.end();
    s.resume();
});
