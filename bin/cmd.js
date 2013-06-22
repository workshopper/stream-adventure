#!/usr/bin/env node
var argv = require('optimist').argv;
var fs = require('fs');
var path = require('path');

var showMenu = require('./menu.js');
var verify = require('./verify.js');
var order = require('../data/order.json');

if (argv.h || argv.help || argv._[0] === 'help') {
    return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

if (argv._[0] === 'list') {
    order.forEach(function (name) {
        console.log(name);
    });
    return;
}

if (argv._[0] === 'current') {
    var current = getData('current');
    console.log(current);
    return;
}

if (argv._[0] === 'select') {
    return onselect(argv._.slice(1).join(' '));
}

if (argv._[0] === 'verify' || argv._[0] === 'run') {
    var current = getData('current');
    if (!current) {
        console.error('ERROR: No active problem. '
            + 'Select a challenge from the menu.'
        );
        return process.exit(1);
    }
    var dir = dirFromName(current);
    var setup = require(dir + '/setup.js')();
    setTimeout(function () {
        var a = [ argv._[1] ].concat(setup.args || []);
        var b = [ dir + '/solution.js' ].concat(setup.args || []);
        var v = verify(a, b, {
            a: setup.a,
            b: setup.b,
            long: setup.long,
            run: argv._[0] === 'run'
        });
        v.on('pass', onpass);
        v.on('fail', onfail);
        
        if (setup.stdin) {
            setup.stdin.pipe(v);
            setup.stdin.resume();
        }
        
        if (setup.a) setup.a.resume();
        if (setup.b) setup.b.resume();
    }, setup.wait || 1);
    
    function onpass () {
        console.log('# PASS');
        console.log('\nYour solution to ' + current + ' passed!');
        console.log(
            '\nHere\'s what the official solution'
            + ' is if you want to compare notes:\n'
        );
        var src = fs.readFileSync(path.join(dir, 'solution.js'), 'utf8');
        src.split('\n').forEach(function (line) {
            console.log('    ' + line);
        });
        
        updateData('completed', function (xs) {
            if (!xs) xs = [];
            var ix = xs.indexOf(current);
            return ix >= 0 ? xs : xs.concat(current);
        });
        
        try { var completed = require('../data/completed.json') }
        catch (e) { completed = [] }
        
        var remaining = order.length - completed.length;
        if (remaining === 0) {
            console.log("You've finished all the challenges! Hooray!\n");
        }
        else {
            console.log('You have ' + remaining + ' challenges left.');
            console.log('Type `stream-adventure` to show the menu.\n');
        }
        
        if (setup.close) setup.close();
    }
    
    function onfail () {
        if (setup.close) setup.close();
        
        console.log('# FAIL');
        console.log(
            "\nYour solution didn't match the expected output."
            + ' Try again!'
        );
    }
}
else {
    var menu = showMenu();
    menu.on('select', onselect);
    menu.on('exit', function () {
        console.log();
        process.exit(0);
    });
}

function onselect (name) {
    console.log('\n  ' + Array(70).join('#'));
    console.log(center('~~  ' + name + '  ~~'));
    console.log('  ' + Array(70).join('#') + '\n');
    
    var dir = dirFromName(name);
    var file = path.resolve(dir, 'problem.txt');
    updateData('current', function (c) { return name });
    var rs = fs.createReadStream(file);
    rs.on('close', function () {
        console.log(
            '\nTo verify your program, run: '
            + '`stream-adventure verify program.js`.\n'
        );
    });
    rs.pipe(process.stdout);
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
