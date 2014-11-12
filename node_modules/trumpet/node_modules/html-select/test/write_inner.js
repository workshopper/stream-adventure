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
    [ 'open', '<li>' ],
    [ 'WROTE', '1' ],
    [ 'close', '</li>' ],
    [ 'text', '\n      \n      ' ],
    [ 'open', '<li>' ],
    [ 'WROTE', '2' ],
    [ 'close', '</li>' ],
    [ 'text', '\n      \n      ' ],
    [ 'open', '<li>' ],
    [ 'WROTE', '3' ],
    [ 'close', '</li>' ],
    [ 'text', '\n      \n      ' ],
    [ 'open', '<li>' ],
    [ 'WROTE', '4' ],
    [ 'close', '</li>' ],
    [ 'text', '\n      \n      ' ],
    [ 'open', '<li>' ],
    [ 'WROTE', '5' ],
    [ 'close', '</li>' ],
    [ 'text', '\n      \n      ' ],
    [ 'open', '<li>' ],
    [ 'WROTE', '6' ],
    [ 'close', '</li>' ],
    [ 'text', '\n    ' ],
    [ 'close', '</ul>' ],
    [ 'text', '\n  ' ],
    [ 'close', '</body>' ],
    [ 'text', '\n' ],
    [ 'close', '</html>' ],
    [ 'text', '\n' ]
];

test('inner write stream', function (t) {
    t.plan(expected.length + 1);
    var n = 0;
    var s = select('li', function (e) {
        e.createWriteStream({ inner: true }).end([ 'WROTE', String(++n) ]);
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
