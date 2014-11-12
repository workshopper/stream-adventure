var select = require('../');
var test = require('tape');
var tokenize = require('html-tokenize');
var through = require('through2');
var fs = require('fs');

test('fork match', function (t) {
    t.plan(5 + 3);
    var s = select();
    
    var a = false;
    s.select('article username', function (e) {
        if (a) return;
        a = true;
        var expected = [
            [ 'open', '<username>' ],
            [ 'open', '<a href="/user/echojs">' ],
            [ 'text', 'echojs' ],
            [ 'close', '</a>' ],
            [ 'close', '</username>' ]
        ];
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual([ row[0], row[1].toString() ], expected.shift());
            next();
        }));
    });
    
    var b = false;
    s.select('article span', function (e) {
        if (b) return;
        b = true;
        var expected = [
            [ 'open', '<span class="upvotes">' ],
            [ 'text', '2' ],
            [ 'close', '</span>' ]
        ];
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            t.deepEqual([ row[0], row[1].toString() ], expected.shift());
            next();
        }));
    });
    
    fs.createReadStream(__dirname + '/fork/index.html')
        .pipe(tokenize()).pipe(s)
    ;
    s.resume();
});
