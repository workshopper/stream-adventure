var test = require('tape');
var split = require('split');
var through = require('through');
var concat = require('concat-stream');
var tuple = require('../');

test('align', function (t) {
    t.plan(1);
    var a = split(), b = split();
    
    tuple(a, b)
        .pipe(through(function (pair) {
            this.queue(pair[0] + ' | ' + pair[1] + '\n');
        }))
        .pipe(concat(function (src) {
            t.equal(src, [
                'one | one',
                'two | two',
                'hree | three',
                '4 | four',
                'five | ',
                ''
            ].join('\n'));
        }))
    ;
    
    a.end('one\ntwo\nhree\n4\nfive');
    b.end('one\ntwo\nthree\nfour\n');
});
