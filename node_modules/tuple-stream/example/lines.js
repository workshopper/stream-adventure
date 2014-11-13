var split = require('split');
var through = require('through');
var tuple = require('../');

var a = split(), b = split();

tuple(a, b).pipe(through(function (pair) {
    this.queue(pair[0] + ' | ' + pair[1] + '\n');
})).pipe(process.stdout);

a.end('one\ntwo\nhree\n4\nfive');
b.end('one\ntwo\nthree\nfour\n');
