var test = require('tape');
var split = require('split');
var through = require('through');
var concat = require('concat-stream');
var tuple = require('../');

test('extra', function (t) {
    t.plan(1);
    var a = split(), b = split();
    
    tuple(a, b)
        .pipe(through(function (pair) {
            this.queue((pair[0] || '') + ' | ' + (pair[1] || '') + '\n');
        }))
        .pipe(concat(function (src) {
            t.equal(src, [
                'one | one',
                ' | two',
                ' | three',
                ' | four',
                ' | ',
                ''
            ].join('\n'));
        }))
    ;
    
    a.end('one\n');
    b.end('one\ntwo\nthree\nfour\n');
});
