#!/usr/bin/env node

var select = require('../');
var split = require('split');
var through = require('through2');
var fs = require('fs');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
    alias: { h: 'help', r: 'raw' },
    boolean: [ 'raw' ]
});
var selector = argv._.join(' ');

if (argv.help) {
    return fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stdout)
    ;
}

var s = select();
s.select(selector, function (e) {
    e.createReadStream().pipe(through.obj(function (row, enc, next) {
        if (argv.raw) {
            console.log(row[1].toString());
        }
        else {
            console.log(JSON.stringify([ row[0], row[1].toString() ]));
        }
        next();
    }));
});

process.stdin.pipe(split(parseLine)).pipe(s);
s.resume();

function parseLine (s) {
    if (!/\S/.test(s)) return;
    var parts = JSON.parse(s);
    return [ parts[0], Buffer(parts[1]) ];
}
