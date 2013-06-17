#!/usr/bin/env node
var argv = require('optimist').argv;
var fs = require('fs');
var path = require('path');

var showMenu = require('./menu.js');
var verify = require('./verify.js');
var order = require('../data/order.json');

if (argv._[0] === 'verify') {
    var current = getData('current');
    if (!current) {
        console.error('ERROR: No active problem. '
            + 'Select a challenge from the menu.'
        );
        return process.exit(1);
    }
    var dir = dirFromName(current);
    var setup = require(dir + '/setup.js');
    var a = [ argv._[1] ].concat(setup.args);
    var b = [ dir + '/solution.js' ].concat(setup.args);
    var v = verify(a, b);
    
    v.on('pass', function () {
        console.log('# PASS');
        console.log('\nYour solution to ' + current + ' passed!');
        updateData('current', function () { return false });
        updateData('completed', function (xs) {
            return (xs || []).concat(current);
        });
        
        try { var completed = require('../data/completed.json') }
        catch (e) { completed = [] }
        
        var remaining = order.length - completed.length;
        if (remaining === 0) {
            console.log("You've finished all the challenges! Hooray!");
        }
        else {
            console.log('You have ' + remaining + ' challenges left.');
            console.log('Type `stream-adventure` to show the menu.');
        }
    });
    
    v.on('fail', function () {
        console.log('# FAIL');
        console.log();
    });
    
    if (setup.stdin) setup.stdin.pipe(v);
}
else {
    var menu = showMenu();
    menu.on('select', function (name) {
        console.log('\n  ' + Array(70).join('#'));
        console.log(center('~~  ' + name + '  ~~'));
        console.log('  ' + Array(70).join('#') + '\n');
        
        var dir = dirFromName(name);
        var file = path.resolve(dir, 'problem.txt');
        updateData('current', function (c) { return name });
        fs.createReadStream(file).pipe(process.stdout);
    });
    menu.on('exit', process.exit);
}

function updateData (name, fn) {
    var json = {};
    try { json = getData(name) }
    catch (e) {}
    var file = path.resolve(__dirname + '/../data', name + '.json');
    fs.writeFileSync(file, JSON.stringify(fn(json)));
}

function getData (name) {
    var file = path.resolve(__dirname + '/../data', name + '.json');
    try { return JSON.parse(fs.readFileSync(file, 'utf8')) }
    catch (e) {}
    return null;
}

function dirFromName (name) {
    return path.resolve(__dirname, '../problems/'
        + name.toLowerCase().replace(/\s/g, '_')
    );
}

function center (s) {
    var n = (67 - s.length) / 2;
    return '  ##' + Array(Math.floor(n)).join(' ')
        + s + Array(Math.ceil(n)).join(' ') + '##'
    ;
}
