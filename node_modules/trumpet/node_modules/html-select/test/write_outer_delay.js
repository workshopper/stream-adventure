var select = require('../');
var test = require('tape');
var through = require('through2');
var tokenize = require('html-tokenize');
var fs = require('fs');

var expected = [
    [ 'open', '<html>' ],
    [ 'text', '\n  ' ],
    [ 'open', '<head>' ],
    [ 'text', '\n    ' ],
    [ 'open', '<title>' ],
    [ 'text', 'presentation examples' ],
    [ 'close', '</title>' ],
    [ 'text', '\n  ' ],
    [ 'close', '</head>' ],
    [ 'text', '\n  ' ],
    [ 'open', '<body>' ],
    [ 'text', '\n    ' ],
    [ 'open', '<h1>' ],
    [ 'text', 'hello there!' ],
    [ 'close', '</h1>' ],
    [ 'text', '\n    ' ],
    [ 'open', '<p>' ],
    [ 'text', '\n      This presentation contains these examples:\n    ' ],
    [ 'close', '</p>' ],
    [ 'text', '\n    \n    ' ],
    [ 'open', '<ul>' ],
    [ 'text', '\n      ' ],
    [ 'WROTE', '1' ],
    [ 'text', '\n      \n      ' ],
    [ 'WROTE', '2' ],
    [ 'text', '\n      \n      ' ],
    [ 'WROTE', '3' ],
    [ 'text', '\n      \n      ' ],
    [ 'WROTE', '4' ],
    [ 'text', '\n      \n      ' ],
    [ 'WROTE', '5' ],
    [ 'text', '\n      \n      ' ],
    [ 'WROTE', '6' ],
    [ 'text', '\n    ' ],
    [ 'close', '</ul>' ],
    [ 'text', '\n  ' ],
    [ 'close', '</body>' ],
    [ 'text', '\n' ],
    [ 'close', '</html>' ],
    [ 'text', '\n' ]
];

test('delayed outer write stream', function (t) {
    t.plan(expected.length + 1);
    var n = 0;
    var s = select('li', function (e) {
        var w = e.createWriteStream({ inner: false });
        setTimeout(function () {
            w.end([ 'WROTE', String(++n) ]);
        }, 5);
    });
    readStream().pipe(tokenize()).pipe(s).pipe(through.obj(write, end));
    
    function write (row, enc, next) {
        var x = [ row[0], row[1].toString('utf8') ];
        t.deepEqual(x, expected.shift(), x[1]);
        next();
    }
    function end () { t.ok(true, 'ended') }
});

function readStream () {
    return fs.createReadStream(__dirname + '/write_inner/index.html');
}
